from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any, Dict
import os
import logging
import uuid
from datetime import datetime, timezone
import io
import json

import pypdf
import docx
import stripe

# NOTE:
# This version removes emergentintegrations dependency (it was failing on Render).
# It uses OpenAI directly if OPENAI_API_KEY is set; otherwise it returns a stable mock analysis.
from openai import OpenAI

# -----------------------------
# Setup / Env
# -----------------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")  # local dev only; Render uses env vars

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("resumeshortlist-backend")

# Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# OpenAI
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# MongoDB (optional)
mongo_url = os.environ.get("MONGO_URL")
db = None
mongo_client = None
if mongo_url:
    try:
        mongo_client = AsyncIOMotorClient(mongo_url)
        db = mongo_client[os.environ.get("DB_NAME", "resumeshortlist")]
        logger.info("MongoDB connected.")
    except Exception as e:
        logger.error(f"Mongo connection failed. Running without DB. Error: {e}")
        db = None
        mongo_client = None
else:
    logger.warning("MONGO_URL not set. Running without DB persistence.")

# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI()
api_router = APIRouter(prefix="/api")

# -----------------------------
# Models
# -----------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class CheckoutRequest(BaseModel):
    # expected: ENTRY, MID, SENIOR, EXEC, CSUITE
    price_key: str
    include_interview_prep: bool = False
    upload_id: Optional[str] = None
    email: Optional[str] = None

class ResumeAnalysisResponse(BaseModel):
    score: int
    summary: str
    suggested_tier: str
    bullet_recommendations: List[str]
    gap_analysis: List[dict]
    filename: str
    upload_id: Optional[str] = None

# -----------------------------
# Helpers
# -----------------------------
def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"
        return text
    except Exception as e:
        logger.error(f"Error reading PDF: {e}")
        return ""

def extract_text_from_docx(file_content: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_content))
        text = ""
        for para in doc.paragraphs:
            text += (para.text or "") + "\n"
        return text
    except Exception as e:
        logger.error(f"Error reading DOCX: {e}")
        return ""

def _safe_default(exec_default: bool = True) -> Dict[str, Any]:
    tier = "EXEC" if exec_default else "MID"
    return {
        "score": 62,
        "summary": (
            "Your resume contains credible experience, but the signal is not being presented in a way that consistently survives modern ATS ranking and recruiter scan patterns. "
            "The top third is not extracting your real scope, leadership level, and quantified outcomes fast enough."
        ),
        "suggested_tier": tier,
        "bullet_recommendations": [
            "Rewrite top-third positioning: add a decisive headline + 3-line value proposition aligned to target roles.",
            "Convert responsibility bullets into outcomes with metrics ($, %, scale, team size, scope).",
            "Add leadership signal: ownership, decision-rights, cross-functional influence, transformation outcomes.",
            "Fix ATS structure: consistent headings, remove dense blocks, ensure clean parsing (avoid tables/columns if present).",
        ],
        "gap_analysis": [
            {
                "category": "Impact Signal",
                "finding": "Recruiters can’t quickly see quantified outcomes (revenue, savings, growth, scale), so ranking drops before interviews are considered.",
            },
            {
                "category": "Positioning",
                "finding": "Your leadership scope and decision-rights are under-stated, which can misclassify you into lower tiers during recruiter triage.",
            },
            {
                "category": "ATS + Keywords",
                "finding": "Section structure and keyword alignment are not engineered to match role requirements, increasing early-stage filtering risk.",
            },
        ],
    }

def _price_id_for_key(key: str) -> Optional[str]:
    """
    Supports both naming patterns:
      - STRIPE_PRICE_ENTRY / STRIPE_PRICE_MID / ...
      - PRICE_ENTRY / PRICE_MID / ... (legacy)
    """
    normalized = (key or "").strip().upper()
    return (
        os.environ.get(f"STRIPE_PRICE_{normalized}")
        or os.environ.get(f"PRICE_{normalized}")
    )

def _interview_price_id() -> Optional[str]:
    return os.environ.get("STRIPE_PRICE_INTERVIEW") or os.environ.get("PRICE_INTERVIEW")

def _exec_signal_hits(text: str) -> int:
    upper = (text or "").upper()
    markers = [
        "DIRECTOR", "VICE PRESIDENT", "VP", "SVP", "EVP", "CFO", "COO", "CEO", "CHIEF",
        "GLOBAL", "ENTERPRISE", "P&L", "BUDGET", "BOARD", "TRANSFORMATION", "OPERATING MODEL"
    ]
    return sum(1 for m in markers if m in upper)

async def analyze_resume_text(text: str) -> Dict[str, Any]:
    """
    Always returns:
      - score (0-100)
      - summary (2 sentences)
      - suggested_tier: ENTRY|MID|SENIOR|EXEC|CSUITE
      - bullet_recommendations: 4 items
      - gap_analysis: 3 items {category,finding}
    Adds exec override if resume contains exec markers and model under-tiers.
    """
    hits = _exec_signal_hits(text)
    exec_default = hits >= 2

    # If no OpenAI configured, return deterministic defaults
    if not openai_client:
        return _safe_default(exec_default=exec_default)

    system_msg = """
You are a strict, executive-grade Resume Auditor.

You MUST return ONLY valid JSON that matches this exact schema:
{
  "score": 0-100,
  "summary": "Exactly 2 sentences.",
  "suggested_tier": "ENTRY|MID|SENIOR|EXEC|CSUITE",
  "bullet_recommendations": ["...", "...", "...", "..."],
  "gap_analysis": [
    {"category":"Impact Signal","finding":"..."},
    {"category":"Positioning","finding":"..."},
    {"category":"ATS + Keywords","finding":"..."}
  ]
}

Rules:
- Be strict (average 45–65; >75 is rare).
- bullet_recommendations MUST be 4 items, concrete and action-oriented.
- gap_analysis MUST be 3 items and each finding must be specific (what fails + why it causes filtering).
- Tier detection:
  ENTRY 0–2 yrs
  MID 2–7 yrs
  SENIOR 7–12 yrs
  EXEC 12+ yrs or Director/VP scope
  CSUITE C-level/SVP/Founder
""".strip()

    user_prompt = f"""
Analyze the resume below. If parts are messy, infer structure and still produce a best-effort audit.

Resume text:
{text[:12000]}
""".strip()

    try:
        resp = openai_client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        content = resp.choices[0].message.content or "{}"
        data = json.loads(content)

        # Normalize and enforce structure
        score_val = int(data.get("score", 60))
        score_val = max(0, min(100, score_val))

        summary = (data.get("summary") or "").strip()
        if not summary:
            summary = _safe_default(exec_default=exec_default)["summary"]

        tier = (data.get("suggested_tier") or "MID").strip().upper()
        if tier not in {"ENTRY", "MID", "SENIOR", "EXEC", "CSUITE"}:
            tier = "MID"

        bullets = data.get("bullet_recommendations") or []
        if not isinstance(bullets, list):
            bullets = []
        bullets = [str(b).strip() for b in bullets if str(b).strip()]
        defaults = _safe_default(exec_default=exec_default)["bullet_recommendations"]
        while len(bullets) < 4:
            bullets.append(defaults[len(bullets)])
        bullets = bullets[:4]

        gaps = data.get("gap_analysis") or []
        if not isinstance(gaps, list):
            gaps = []
        cleaned_gaps = []
        for g in gaps:
            if isinstance(g, dict):
                cat = str(g.get("category", "")).strip() or "General"
                finding = str(g.get("finding", "")).strip()
                if finding:
                    cleaned_gaps.append({"category": cat, "finding": finding})
        defaults_g = _safe_default(exec_default=exec_default)["gap_analysis"]
        while len(cleaned_gaps) < 3:
            cleaned_gaps.append(defaults_g[len(cleaned_gaps)])
        cleaned_gaps = cleaned_gaps[:3]

        # Executive override: if exec signals present, don't allow MID as final
        if exec_default and tier in {"MID", "SENIOR"}:
            tier = "EXEC"

        return {
            "score": score_val,
            "summary": summary,
            "suggested_tier": tier,
            "bullet_recommendations": bullets,
            "gap_analysis": cleaned_gaps,
        }

    except Exception as e:
        logger.error(f"OpenAI analysis error: {e}")
        return _safe_default(exec_default=exec_default)

# -----------------------------
# Routes
# -----------------------------
@api_router.get("/")
async def root():
    return {"message": "ResumeShortlist API Running"}

@api_router.get("/health")
async def health():
    return {"ok": True, "db": bool(db), "openai": bool(openai_client)}

@api_router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = (file.filename or "resume").lower()

    text = ""
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        text = extract_text_from_docx(content)
    else:
        try:
            text = content.decode("utf-8")
        except Exception:
            raise HTTPException(status_code=400, detail="Unsupported file format")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    analysis = await analyze_resume_text(text)
    upload_id = str(uuid.uuid4())

    # Save minimal metadata if DB is configured
    if db:
        try:
            await db.uploads.insert_one(
                {
                    "id": upload_id,
                    "filename": file.filename,
                    "timestamp": datetime.now(timezone.utc),
                    "score": analysis["score"],
                    "text_preview": text[:200],
                }
            )
        except Exception as e:
            logger.error(f"DB insert failed (uploads). Continuing without DB. Error: {e}")

    # Return stable keys that frontend should render
    return {
        "upload_id": upload_id,
        "filename": file.filename,
        "score": analysis["score"],
        "summary": analysis["summary"],
        "suggested_tier": analysis["suggested_tier"],
        "bullet_recommendations": analysis["bullet_recommendations"],
        "gap_analysis": analysis["gap_analysis"],
    }

@api_router.post("/checkout")
async def create_checkout_session(request: CheckoutRequest, req: Request):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured (missing STRIPE_SECRET_KEY)")

    price_id = _price_id_for_key(request.price_key)
    if not price_id:
        raise HTTPException(status_code=400, detail=f"Invalid price tier or missing env var for {request.price_key}")

    line_items = [{"price": price_id, "quantity": 1}]

    if request.include_interview_prep:
        interview_price_id = _interview_price_id()
        if not interview_price_id:
            raise HTTPException(status_code=400, detail="Interview prep selected but price not configured")
        line_items.append({"price": interview_price_id, "quantity": 1})

    # Determine base URL dynamically if possible, else fallback
    base_url = os.environ.get("FRONTEND_URL", FRONTEND_URL)
    if req.headers.get("origin"):
        base_url = req.headers.get("origin")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{base_url}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{base_url}/results",
            metadata={
                "upload_id": request.upload_id or "",
                "tier": request.price_key,
                "email": request.email or "",
                "interview_prep": str(bool(request.include_interview_prep)),
            },
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        logger.error(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail="Stripe checkout failed")

@api_router.post("/verify-session")
async def verify_session(session_id: str = Form(...)):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured (missing STRIPE_SECRET_KEY)")

    try:
        session = stripe.checkout.Session.retrieve(session_id)

        if session.payment_status == "paid":
            metadata = session.metadata or {}

            if db:
                try:
                    await db.orders.insert_one(
                        {
                            "stripe_session_id": session_id,
                            "amount": session.amount_total,
                            "email": (session.customer_details.email if session.customer_details else metadata.get("email")),
                            "tier": metadata.get("tier"),
                            "upload_id": metadata.get("upload_id"),
                            "status": "paid_pending_review",
                            "timestamp": datetime.now(timezone.utc),
                        }
                    )
                except Exception as e:
                    logger.error(f"DB insert failed (orders). Continuing without DB. Error: {e}")

            return {
                "status": "paid",
                "email": (session.customer_details.email if session.customer_details else metadata.get("email")),
            }

        return {"status": "unpaid"}

    except Exception as e:
        logger.error(f"Verify session error: {e}")
        raise HTTPException(status_code=400, detail="Invalid Session")

# Include the router
app.include_router(api_router)

# -----------------------------
# CORS (fix wildcard + credentials issue)
# -----------------------------
cors_raw = os.environ.get("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

# If wildcard is used, credentials must be False (browser rejects otherwise)
allow_credentials = True
if "*" in origins:
    allow_credentials = False
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=allow_credentials,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if mongo_client:
        mongo_client.close()
