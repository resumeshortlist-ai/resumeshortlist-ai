from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request
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
import time

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
# FastAPI App + CORS
# -----------------------------
app = FastAPI()

# IMPORTANT:
# - allow_credentials=True means you cannot use allow_origins=["*"]
# - Vercel preview URLs change constantly, so we allow them via regex for THIS project.
#
# This regex matches:
#   https://resumeshortlist-<anything>-shortlistais-projects.vercel.app
#   https://resumeshortlist-ai-<anything>-shortlistais-projects.vercel.app
#   https://resumeshortlist-ai.vercel.app
#   https://resumeshortlist.vercel.app
#
VERCEL_PREVIEW_REGEX = r"^https:\/\/resumeshortlist(?:-ai)?(?:-[a-z0-9]+-shortlistais-projects)?\.vercel\.app$"

# Also allow your stable production/custom domains via env var:
# Example:
# CORS_ORIGINS=https://resumeshortlist.app,https://resumeshortlist-ai.vercel.app
cors_raw = os.environ.get("CORS_ORIGINS", "")
allow_origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

# Add localhost for local dev convenience
for local in ["http://localhost:3000", "http://127.0.0.1:3000"]:
    if local not in allow_origins:
        allow_origins.append(local)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,          # stable origins
    allow_origin_regex=VERCEL_PREVIEW_REGEX,  # all Vercel previews for this project
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")


# -----------------------------
# Models
# -----------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
        d = docx.Document(io.BytesIO(file_content))
        return "\n".join([(p.text or "") for p in d.paragraphs])
    except Exception as e:
        logger.error(f"Error reading DOCX: {e}")
        return ""

def _fallback_analysis() -> Dict[str, Any]:
    return {
        "score": 65,
        "summary": "Automated analysis unavailable. Add more measurable impact and tighten targeting.",
        "suggested_tier": "MID",
        "bullet_recommendations": [
            "Add hard metrics ($, %, volume, team size) to each role.",
            "Replace passive phrasing with leadership verbs (Led, Owned, Delivered).",
            "Strengthen the top section: headline + 6–10 role-specific keywords.",
            "Reduce density: 3–5 bullets per role, one line each where possible."
        ],
        "gap_analysis": [
            {"category": "Impact", "finding": "The resume lists responsibilities more than quantified outcomes."},
            {"category": "Targeting", "finding": "Keywords and role signals are too broad for recruiter filtering."},
            {"category": "Clarity", "finding": "Bullets are dense; key wins are not immediately scannable."}
        ],
    }

def _price_id_for_key(key: str) -> Optional[str]:
    normalized = (key or "").strip().upper()
    # Prefer STRIPE_PRICE_*, fallback to PRICE_* if you used older naming
    return os.environ.get(f"STRIPE_PRICE_{normalized}") or os.environ.get(f"PRICE_{normalized}")

def _interview_price_id() -> Optional[str]:
    return os.environ.get("STRIPE_PRICE_INTERVIEW") or os.environ.get("PRICE_INTERVIEW")

def _openai_analyze(text: str) -> Dict[str, Any]:
    if not openai_client:
        return _fallback_analysis()

    system_msg = """
You are a strict, high-end Resume Auditor.
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

Rules:
- Be strict. Typical score 45–65.
- Tier must reflect true seniority (EXEC for 12+ yrs, Director/VP).
- Gap analysis must be specific and actionable (not generic).
""".strip()

    user_msg = f"Analyze this resume:\n\n{text[:12000]}"

    # Simple retry for 429/rate limit spikes
    for attempt in range(3):
        try:
            resp = openai_client.chat.completions.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": user_msg},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            content = resp.choices[0].message.content or "{}"
            data = json.loads(content)

            score = int(data.get("score", 60))
            score = max(0, min(100, score))

            bullets = data.get("bullet_recommendations") or []
            if not isinstance(bullets, list):
                bullets = []

            gaps = data.get("gap_analysis") or []
            if not isinstance(gaps, list):
                gaps = []

            return {
                "score": score,
                "summary": data.get("summary", "Analysis incomplete."),
                "suggested_tier": (data.get("suggested_tier") or "MID").strip().upper(),
                "bullet_recommendations": bullets[:4],
                "gap_analysis": gaps[:3],
            }
        except Exception as e:
            msg = str(e)
            logger.error(f"OpenAI error (attempt {attempt+1}/3): {msg}")
            # backoff a bit on rate limit
            time.sleep(0.7 * (attempt + 1))

    return {
        "score": 55,
        "summary": "Automated analysis failed. Please try again in a minute.",
        "suggested_tier": "MID",
        "bullet_recommendations": ["Resubmit for detailed analysis.", "Ensure the file is text-readable (not scanned)."],
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

    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        text = extract_text_from_docx(content)
    else:
        try:
            text = content.decode("utf-8")
        except Exception:
            raise HTTPException(status_code=400, detail="Unsupported file format")

    if not (text or "").strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    analysis = _openai_analyze(text)
    upload_id = str(uuid.uuid4())

    if db:
        try:
            await db.uploads.insert_one({
                "id": upload_id,
                "filename": file.filename,
                "timestamp": datetime.now(timezone.utc),
                "score": analysis["score"],
                "text_preview": text[:200],
            })
        except Exception as e:
            logger.error(f"DB insert failed (uploads): {e}")

    # Return keys compatible with your UI
    return {
        "upload_id": upload_id,
        "filename": file.filename,
        "score": analysis["score"],
        "summary": analysis["summary"],
        "suggested_tier": analysis["suggested_tier"],
        "bullet_recommendations": analysis["bullet_recommendations"],
        "bullets": analysis["bullet_recommendations"],   # keep both to avoid frontend mismatch
        "gap_analysis": analysis["gap_analysis"],
    }

@api_router.post("/checkout")
async def create_checkout_session(request: CheckoutRequest, req: Request):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured (missing STRIPE_SECRET_KEY)")

    price_id = _price_id_for_key(request.price_key)
    if not price_id:
        raise HTTPException(status_code=400, detail=f"Missing Stripe price env var for {request.price_key}")

    line_items = [{"price": price_id, "quantity": 1}]

    if request.include_interview_prep:
        interview_price_id = _interview_price_id()
        if not interview_price_id:
            raise HTTPException(status_code=400, detail="Interview prep selected but price not configured")
        line_items.append({"price": interview_price_id, "quantity": 1})

    base_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
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
                    await db.orders.insert_one({
                        "stripe_session_id": session_id,
                        "amount": session.amount_total,
                        "email": (session.customer_details.email if session.customer_details else metadata.get("email")),
                        "tier": metadata.get("tier"),
                        "upload_id": metadata.get("upload_id"),
                        "status": "paid_pending_review",
                        "timestamp": datetime.now(timezone.utc),
                    })
                except Exception as e:
                    logger.error(f"DB insert failed (orders): {e}")

            return {"status": "paid", "email": (session.customer_details.email if session.customer_details else metadata.get("email"))}

        return {"status": "unpaid"}
    except Exception as e:
        logger.error(f"Verify session error: {e}")
        raise HTTPException(status_code=400, detail="Invalid Session")


app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    if mongo_client:
        mongo_client.close()
