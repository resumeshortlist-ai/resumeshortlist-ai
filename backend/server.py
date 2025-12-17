from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import os
import logging
import uuid
from datetime import datetime, timezone
import io
import json
import re

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
class CheckoutRequest(BaseModel):
    # expected: ENTRY, MID, SENIOR, EXEC, CSUITE
    price_key: str
    include_interview_prep: bool = False
    upload_id: Optional[str] = None
    email: Optional[str] = None

# -----------------------------
# Helpers
# -----------------------------
def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += (page.extract_text() or "") + "\n"
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

def _fallback_analysis(tier_hint: str = "MID") -> Dict[str, Any]:
    return {
        "score": 62,
        "summary": "Your resume has credible experience, but it is under-positioned for modern ATS + recruiter scan patterns.",
        "suggested_tier": tier_hint,
        "bullet_recommendations": [
            "Add metrics ($, %, volume, team size) to 70%+ of bullets.",
            "Replace passive phrasing with ownership verbs (Led, Owned, Delivered, Drove).",
            "Tighten the top third with a targeted headline + role-specific keywords.",
            "Rebuild bullets around outcomes, not responsibilities."
        ],
        "gap_analysis": [
            {"category": "Impact", "finding": "You describe duties, but you don’t quantify outcomes (revenue, savings, growth, scope)."},
            {"category": "Targeting", "finding": "Role signal is diluted; the resume reads generalist, which lowers ranking for specific roles."},
            {"category": "ATS Compliance", "finding": "Formatting/structure may reduce parsing accuracy across ATS variants."}
        ],
    }

def _price_id_for_key(key: str) -> Optional[str]:
    """
    Supports both naming patterns:
      - STRIPE_PRICE_ENTRY / STRIPE_PRICE_MID / ...
      - PRICE_ENTRY / PRICE_MID / ... (legacy)
    """
    normalized = (key or "").strip().upper()
    return os.environ.get(f"STRIPE_PRICE_{normalized}") or os.environ.get(f"PRICE_{normalized}")

def _interview_price_id() -> Optional[str]:
    return os.environ.get("STRIPE_PRICE_INTERVIEW") or os.environ.get("PRICE_INTERVIEW")

def _infer_tier_heuristic(text: str) -> str:
    t = (text or "").lower()

    # Strong signals
    if re.search(r"\b(ceo|cfo|coo|cto|cio|chief\s+officer|svp|evp|president)\b", t):
        return "CSUITE"
    if re.search(r"\b(vice\s+president|vp\b|director|head\s+of)\b", t):
        return "EXEC"
    if re.search(r"\b(senior\s+manager|manager|team\s+lead|lead\b)\b", t):
        return "SENIOR"

    # Weak signals
    if re.search(r"\b(intern|student|new\s+grad|graduate)\b", t):
        return "ENTRY"

    return "MID"

def _normalize_analysis(data: Dict[str, Any], tier_hint: str) -> Dict[str, Any]:
    # Score
    try:
        score_val = int(data.get("score", 60))
    except Exception:
        score_val = 60
    score_val = max(0, min(100, score_val))

    # Tier
    tier = (data.get("suggested_tier") or tier_hint or "MID").strip().upper()
    if tier not in {"ENTRY", "MID", "SENIOR", "EXEC", "CSUITE"}:
        tier = tier_hint

    # Bullets
    bullets = data.get("bullet_recommendations") or data.get("bullets") or []
    if not isinstance(bullets, list):
        bullets = []
    bullets = [str(b).strip() for b in bullets if str(b).strip()]
    if len(bullets) < 3:
        bullets = (_fallback_analysis(tier_hint)["bullet_recommendations"])[:4]

    # Gaps
    gaps = data.get("gap_analysis") or []
    if not isinstance(gaps, list):
        gaps = []
    cleaned_gaps = []
    for g in gaps:
        if isinstance(g, dict) and g.get("category") and g.get("finding"):
            cleaned_gaps.append({"category": str(g["category"]).strip(), "finding": str(g["finding"]).strip()})
    if len(cleaned_gaps) < 2:
        cleaned_gaps = _fallback_analysis(tier_hint)["gap_analysis"]

    summary = str(data.get("summary") or _fallback_analysis(tier_hint)["summary"]).strip()

    return {
        "score": score_val,
        "summary": summary,
        "suggested_tier": tier,
        "bullet_recommendations": bullets[:4],
        "gap_analysis": cleaned_gaps[:3],
    }

async def analyze_resume_text(text: str) -> Dict[str, Any]:
    tier_hint = _infer_tier_heuristic(text)

    # If OpenAI not configured, return fallback
    if not openai_client:
        return _fallback_analysis(tier_hint)

    system_msg = """
You are a strict, executive-grade Resume Auditor.

Goal:
- Produce a harsh-but-true ATS + recruiter triage audit.
- Provide actionable, specific fixes (not generic advice).
- Classify tier correctly.

Rules:
1) Be strict. Average score: 45–65. >75 only if genuinely excellent.
2) Gap analysis must be 3 distinct, specific reasons this resume fails.
3) Bullet recommendations must be 3–4 very concrete edits.
4) Tier definitions:
   ENTRY (0–2 yrs), MID (2–7), SENIOR (7–12), EXEC (12+ Director/VP), CSUITE (C-level/SVP/Founder)

Return ONLY valid JSON with this schema:
{
  "score": 0-100,
  "summary": "2 sentences",
  "suggested_tier": "ENTRY|MID|SENIOR|EXEC|CSUITE",
  "bullet_recommendations": ["...", "...", "...", "..."],
  "gap_analysis": [
    {"category":"Impact","finding":"..."},
    {"category":"ATS Compliance","finding":"..."},
    {"category":"Targeting","finding":"..."}
  ]
}
""".strip()

    user_prompt = f"""
Tier hint (heuristic, may be wrong): {tier_hint}

Analyze this resume text:

{text[:14000]}
""".strip()

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
        data = json.loads(content)
        return _normalize_analysis(data, tier_hint)

    except Exception as e:
        logger.error(f"OpenAI analysis error: {e}")
        return {
            "score": 55,
            "summary": "Automated analysis failed. Manual review required.",
            "suggested_tier": tier_hint,
            "bullet_recommendations": [
                "Resubmit for detailed analysis.",
                "Ensure the file is text-readable (not scanned).",
                "Try exporting your resume as a text-based PDF (not an image).",
                "Remove unusual fonts/graphics that can break parsing."
            ],
            "gap_analysis": [{"category": "Error", "finding": "System could not process this file deeply."}],
        }

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

    # Save minimal metadata if DB configured
    if db:
        try:
            await db.uploads.insert_one(
                {
                    "id": upload_id,
                    "filename": file.filename,
                    "timestamp": datetime.now(timezone.utc),
                    "score": analysis["score"],
                    "tier": analysis["suggested_tier"],
                    "text_preview": text[:400],
                }
            )
        except Exception as e:
            logger.error(f"DB insert failed (uploads). Continuing without DB. Error: {e}")

    # IMPORTANT: return keys your UI expects (and keep aliases)
    return {
        "upload_id": upload_id,
        "filename": file.filename,
        "score": analysis["score"],
        "summary": analysis["summary"],
        "suggested_tier": analysis["suggested_tier"],
        "bullet_recommendations": analysis["bullet_recommendations"],
        "bullets": analysis["bullet_recommendations"],
        "gap_analysis": analysis["gap_analysis"],
    }

@api_router.post("/checkout")
async def create_checkout_session(request: CheckoutRequest, req: Request):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured (missing STRIPE_SECRET_KEY)")

    price_id = _price_id_for_key(request.price_key)
    if not price_id:
        raise HTTPException(status_code=400, detail=f"Invalid tier or missing price env for {request.price_key}")

    line_items = [{"price": price_id, "quantity": 1}]

    if request.include_interview_prep:
        interview_price = _interview_price_id()
        if not interview_price:
            raise HTTPException(status_code=400, detail="Interview prep selected but price not configured")
        line_items.append({"price": interview_price, "quantity": 1})

    base_url = os.environ.get("FRONTEND_URL", "")
    origin = req.headers.get("origin")
    if origin:
        base_url = origin
    if not base_url:
        base_url = "http://localhost:3000"

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

            return {"status": "paid", "email": (session.customer_details.email if session.customer_details else metadata.get("email"))}

        return {"status": "unpaid"}

    except Exception as e:
        logger.error(f"Verify session error: {e}")
        raise HTTPException(status_code=400, detail="Invalid Session")

# Include router
app.include_router(api_router)

# -----------------------------
# CORS (IMPORTANT FIX)
# -----------------------------
cors_raw = os.environ.get("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

# Browsers reject Access-Control-Allow-Origin: * with credentials=true
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
