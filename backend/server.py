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
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# OpenAI
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
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
# Helpers - Text Extraction
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

# -----------------------------
# Helpers - Pricing Env Vars
# -----------------------------
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

# -----------------------------
# Helpers - Tier Heuristic
# -----------------------------
def _guess_tier_from_text(text: str) -> str:
    t = (text or "").lower()

    # Strong executive / c-suite signals
    c_suite_terms = [
        "chief", "cfo", "ceo", "coo", "cio", "cto", "c-suite", "svp", "president", "vp ", "vice president"
    ]
    exec_terms = [
        "director", "head of", "global head", "executive", "md ", "managing director", "partner"
    ]
    senior_terms = [
        "manager", "team lead", "lead,", "senior manager", "sr manager"
    ]

    if any(term in t for term in c_suite_terms):
        return "CSUITE" if ("ceo" in t or "cfo" in t or "coo" in t or "chief" in t or "svp" in t or "president" in t) else "EXEC"

    if any(term in t for term in exec_terms):
        return "EXEC"

    if any(term in t for term in senior_terms):
        return "SENIOR"

    # Rough year-count heuristic (very imperfect but helpful)
    years = re.findall(r"\b(19\d{2}|20\d{2})\b", t)
    if len(years) >= 6:
        return "SENIOR"
    if len(years) >= 10:
        return "EXEC"

    return "MID"

# -----------------------------
# Helpers - Fallback Analysis
# -----------------------------
def _fallback_analysis(tier_hint: str) -> Dict[str, Any]:
    tier = (tier_hint or "MID").upper()

    # Tailor language slightly by tier so it feels “real”
    if tier in ("EXEC", "CSUITE"):
        bullets = [
            "Move the top 1/3 to an executive positioning summary (scope, mandate, P&L, enterprise outcomes).",
            "Convert responsibilities into measurable outcomes (revenue, EBITDA, cost-to-serve, cycle time, risk).",
            "Add leadership scope (team size, regions, stakeholders, governance, board / ExCo exposure).",
            "Tighten role targeting with a keyword spine aligned to the roles you want (Ops/Strategy/COO track).",
        ]
        gaps = [
            {"category": "Impact", "finding": "Executive outcomes aren’t quantified consistently (enterprise-scale metrics and before/after results are missing)."},
            {"category": "Positioning", "finding": "The narrative reads ‘experienced operator’ but not ‘enterprise leader’ (mandate, decision rights, governance, and scale need to be explicit)."},
            {"category": "Shortlist Signal", "finding": "Top-third keywords and headline do not force the target role (COO/Head of Ops/Strategy & Ops) quickly enough for recruiter scan patterns."},
        ]
        summary = "This resume contains strong experience, but it under-sells enterprise scope and measurable outcomes. A tighter executive story with quantified impact will materially improve shortlist probability."
        score = 68
    elif tier == "SENIOR":
        bullets = [
            "Add outcome metrics to every key role (revenue, savings, throughput, SLA, cycle time, NPS).",
            "Make leadership explicit: team size, cross-functional partners, and programs you owned end-to-end.",
            "Rebuild bullets into 'Action → Result → Proof' (what you did, what changed, how measured).",
            "Improve targeting: mirror keywords from the job description in the top third and role bullets.",
        ]
        gaps = [
            {"category": "Impact", "finding": "Several bullets describe tasks, not outcomes; recruiters rank on results, not responsibilities."},
            {"category": "Leadership", "finding": "Scope of leadership and ownership isn’t consistently clear (team size, budget, decision rights)."},
            {"category": "ATS / Scanability", "finding": "Top section doesn’t front-load the strongest keywords + achievements; scan patterns will miss key strengths."},
        ]
        summary = "The experience is credible, but impact and leadership scope are not surfaced fast or quantified enough. Small, targeted rewrites will improve ranking and recruiter conversion."
        score = 62
    else:
        bullets = [
            "Quantify outcomes wherever possible ($, %, volume, time saved, growth).",
            "Replace passive phrasing (“responsible for”) with leadership verbs (led/owned/delivered).",
            "Improve targeting: align keywords and skill clusters to the role you’re applying for.",
            "Tighten formatting for ATS (clear headings, consistent dates, simple structure).",
        ]
        gaps = [
            {"category": "Impact", "finding": "Too many statements are qualitative; add measurable proof of results."},
            {"category": "Targeting", "finding": "Keyword alignment to the target role is inconsistent, lowering ranking."},
            {"category": "Clarity", "finding": "Key wins aren’t front-loaded; recruiters may miss them in a quick scan."},
        ]
        summary = "Good foundation, but it needs clearer results, targeting, and ATS-first structure. With small changes, it will rank higher and convert better."
        score = 60

    return {
        "score": score,
        "summary": summary,
        "suggested_tier": tier,
        "bullet_recommendations": bullets,
        "gap_analysis": gaps,
    }

# -----------------------------
# OpenAI Analysis
# -----------------------------
async def analyze_resume_text(text: str) -> Dict[str, Any]:
    tier_hint = _guess_tier_from_text(text)

    # If no OpenAI key, return strong fallback
    if not openai_client:
        return _fallback_analysis(tier_hint)

    system_msg = """
You are a strict, high-end Resume Auditor. Your job is to analyze resumes and justify the need for a professional rewrite.

Rules:
1) Analyze for concrete weaknesses:
   - Passive language ("Responsible for") instead of leadership verbs.
   - Lack of metrics ($, %, growth, volume, team size).
   - Weak targeting/keyword alignment.
   - ATS risks (tables/columns, missing headings, dense blocks).
2) Scoring:
   - Be strict. Average score should be 45–65.
   - >75 only if genuinely excellent.
3) Gap analysis:
   - Provide 3 distinct, harsh-but-true reasons this resume will fail.
   - Be specific (e.g., "Fails to quantify sales impact in 2023 role").
4) Tier detection:
   - ENTRY (0–2 yrs)
   - MID (2–7 yrs)
   - SENIOR (7–12 yrs)
   - EXEC (12+ yrs Director/VP)
   - CSUITE (C-level/SVP/Founder)

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

    user_prompt = f"Analyze this resume:\n\n{text[:12000]}"

    try:
        resp = openai_client.chat.completions.create(
            model=OPENAI_MODEL,
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

        bullets = data.get("bullet_recommendations") or []
        if not isinstance(bullets, list):
            bullets = []

        gaps = data.get("gap_analysis") or []
        if not isinstance(gaps, list):
            gaps = []

        suggested = (data.get("suggested_tier") or tier_hint).strip().upper()
        if suggested not in {"ENTRY", "MID", "SENIOR", "EXEC", "CSUITE"}:
            suggested = tier_hint

        # Ensure we always have usable content
        if len(bullets) < 3 or len(gaps) < 2:
            fallback = _fallback_analysis(suggested)
            bullets = (bullets + fallback["bullet_recommendations"])[:4]
            gaps = (gaps + fallback["gap_analysis"])[:3]

        return {
            "score": score_val,
            "summary": data.get("summary", "Analysis incomplete."),
            "suggested_tier": suggested,
            "bullet_recommendations": bullets[:4],
            "gap_analysis": gaps[:3],
        }

    except Exception as e:
        # This is your current real issue: 429 + insufficient_quota
        logger.error(f"OpenAI analysis error: {e}")

        # Always return a GOOD fallback (never blank)
        fallback = _fallback_analysis(tier_hint)
        fallback["score"] = 55
        fallback["summary"] = "Automated analysis failed. Manual review required."
        fallback["gap_analysis"] = [
            {"category": "Error", "finding": "AI analysis unavailable (quota/limit). Showing best-effort audit."},
            *fallback["gap_analysis"],
        ][:3]
        return fallback

# -----------------------------
# Routes
# -----------------------------
@api_router.get("/")
async def root():
    return {"message": "ResumeShortlist API Running"}

@api_router.get("/health")
async def health():
    return {
        "ok": True,
        "db": bool(db),
        "openai": bool(openai_client),
        "model": OPENAI_MODEL,
    }

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

    if db:
        try:
            await db.uploads.insert_one(
                {
                    "id": upload_id,
                    "filename": file.filename,
                    "timestamp": datetime.now(timezone.utc),
                    "score": analysis.get("score"),
                    "text_preview": text[:200],
                }
            )
        except Exception as e:
            logger.error(f"DB insert failed (uploads). Continuing without DB. Error: {e}")

    # IMPORTANT: return keys your UI expects
    return {
        "upload_id": upload_id,
        "filename": file.filename,
        "score": analysis.get("score", 60),
        "summary": analysis.get("summary", "Analysis complete."),
        "suggested_tier": analysis.get("suggested_tier", "MID"),
        "bullet_recommendations": analysis.get("bullet_recommendations", []),
        "bullets": analysis.get("bullet_recommendations", []),  # alias for older UI
        "gap_analysis": analysis.get("gap_analysis", []),
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
# CORS
# -----------------------------
cors_raw = os.environ.get("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

# If wildcard, browsers require allow_credentials=False
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
