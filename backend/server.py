from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request
from dotenv import load_dotenv
from fastapi.responses import RedirectResponse
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

# MongoDB (optional; do not crash if missing)
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

def _clean_json_like(content: str) -> str:
    c = (content or "").strip()
    if "```json" in c:
        c = c.split("```json", 1)[1].split("```", 1)[0].strip()
    elif "```" in c:
        c = c.split("```", 1)[1].split("```", 1)[0].strip()
    return c

def _fallback_analysis(reason: str = "Fallback analysis used.") -> Dict[str, Any]:
    # IMPORTANT: Always return non-empty gap_analysis + bullets so UI doesn't look blank
    return {
        "score": 58,
        "summary": f"{reason} Your resume needs clearer executive impact signals and stronger targeting.",
        "suggested_tier": "EXEC",
        "bullet_recommendations": [
            "Add 3–5 hard metrics ($, %, volume, cost savings, growth) to each recent role.",
            "Rewrite bullets to lead with outcomes: 'Delivered X resulting in Y' (not duties).",
            "Sharpen your headline + positioning (target role + niche + signature strengths).",
            "Add an 'Executive Impact' section with 4–6 quantified wins."
        ],
        "gap_analysis": [
            {"category": "Impact", "finding": "Key bullets read like responsibilities; recruiters shortlist measurable outcomes."},
            {"category": "Positioning", "finding": "Executive narrative (scope, scale, leadership) isn’t explicit in the top third."},
            {"category": "Targeting", "finding": "Missing role-specific keywords and industry language that ATS expects."}
        ]
    }

def _price_id_for_key(key: str) -> Optional[str]:
    normalized = (key or "").strip().upper()
    # Support STRIPE_PRICE_* naming
    return os.environ.get(f"STRIPE_PRICE_{normalized}") or os.environ.get(f"PRICE_{normalized}")

def _interview_price_id() -> Optional[str]:
    return os.environ.get("STRIPE_PRICE_INTERVIEW") or os.environ.get("PRICE_INTERVIEW")

async def analyze_resume_text(text: str) -> Dict[str, Any]:
    if not openai_client:
        return _fallback_analysis("OpenAI is not configured (missing OPENAI_API_KEY).")

    system_msg = """
You are a strict, high-end Resume Auditor for competitive roles (including executive roles).
Your job: produce a candid, specific audit that explains why this resume will be filtered, and what to fix.

Rules:
1) Be specific and evidence-based:
   - Call out missing metrics ($, %, volume, team size, scope, budgets).
   - Call out weak verbs and duty statements.
   - Call out executive signal (strategy, P&L, transformation, leadership).
   - Call out ATS risks (missing headings, inconsistent structure, dense blocks).
2) Scoring:
   - Be strict. Average is 45–65.
   - Only give >75 if exceptional (rare).
3) Gap analysis:
   - Provide exactly 3 gaps with categories and direct findings.
4) Prioritized corrections:
   - Provide exactly 4 bullet recommendations that are actionable.
5) Tier detection:
   - ENTRY (0–2), MID (2–7), SENIOR (7–12), EXEC (12+ Director/VP), CSUITE (C-level/SVP/Founder).
   - If leadership scope + strategic ownership appears, bias upward (EXEC/CSUITE).

Return ONLY valid JSON with this schema:
{
  "score": 0-100,
  "summary": "2 sentences",
  "suggested_tier": "ENTRY|MID|SENIOR|EXEC|CSUITE",
  "bullet_recommendations": ["...", "...", "...", "..."],
  "gap_analysis": [
    {"category":"Impact","finding":"..."},
    {"category":"Positioning","finding":"..."},
    {"category":"ATS/Keywords","finding":"..."}
  ]
}
""".strip()

    user_prompt = f"Analyze this resume:\n\n{text[:12000]}"

    try:
        resp = openai_client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        content = resp.choices[0].message.content or ""
        content = _clean_json_like(content)
        data = json.loads(content)

        score_val = int(data.get("score", 60))
        score_val = max(0, min(100, score_val))

        tier = (data.get("suggested_tier") or "MID").strip().upper()
        if tier not in {"ENTRY", "MID", "SENIOR", "EXEC", "CSUITE"}:
            tier = "MID"

        bullets = data.get("bullet_recommendations") or []
        if not isinstance(bullets, list):
            bullets = []
        bullets = [str(b).strip() for b in bullets if str(b).strip()][:4]

        gaps = data.get("gap_analysis") or []
        if not isinstance(gaps, list):
            gaps = []
        # normalize gap objects
        norm_gaps = []
        for g in gaps:
            if isinstance(g, dict):
                cat = str(g.get("category", "")).strip() or "Gap"
                finding = str(g.get("finding", "")).strip() or "Missing details."
                norm_gaps.append({"category": cat, "finding": finding})
        norm_gaps = norm_gaps[:3]

        # Safety: never return empty arrays (UI looks broken)
        if len(bullets) < 4 or len(norm_gaps) < 3:
            fallback = _fallback_analysis("Analysis returned incomplete fields.")
            bullets = bullets if len(bullets) >= 2 else fallback["bullet_recommendations"]
            norm_gaps = norm_gaps if len(norm_gaps) >= 2 else fallback["gap_analysis"]

        return {
            "score": score_val,
            "summary": str(data.get("summary", "Analysis incomplete.")).strip(),
            "suggested_tier": tier,
            "bullet_recommendations": bullets,
            "gap_analysis": norm_gaps,
        }

    except Exception as e:
        # Common: quota, rate limit, transient HTTP issues, JSON parse errors
        logger.error(f"OpenAI analysis error: {e}")
        return _fallback_analysis("Automated analysis failed (OpenAI error).")

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

    # Save minimal upload metadata if DB is configured
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

    # Return keys compatible with your frontend (both bullets and bullet_recommendations)
    return {
        "upload_id": upload_id,
        "filename": file.filename,
        "score": analysis["score"],
        "summary": analysis["summary"],
        "suggested_tier": analysis["suggested_tier"],
        "bullet_recommendations": analysis["bullet_recommendations"],
        "bullets": analysis["bullet_recommendations"],  # alias for older UI code
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
        logger.error(f"Stripe checkout error: {e}")
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

# Include router
app.include_router(api_router)

# -----------------------------
# CORS (IMPORTANT)
# -----------------------------
# Expect: CORS_ORIGINS="https://your-vercel-domain.vercel.app,https://your-custom-domain.com"
cors_raw = os.environ.get("CORS_ORIGINS", "")
origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

if not origins:
    # Safe default for LOCAL DEV only
    origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
    logger.warning("CORS_ORIGINS not set. Defaulting to localhost origins only.")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if mongo_client:
        mongo_client.close()
