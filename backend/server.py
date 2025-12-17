from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import pypdf
import docx
import io
import stripe
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Load env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'resumeshortlist')]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# --- Models ---

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class CheckoutRequest(BaseModel):
    price_key: str # ENTRY, MID, SENIOR, EXEC, CSUITE
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

# --- Helpers ---

def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"Error reading PDF: {e}")
        return ""

def extract_text_from_docx(file_content: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_content))
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        logger.error(f"Error reading DOCX: {e}")
        return ""

async def analyze_resume_text(text: str) -> dict:
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        return {
            "score": 65,
            "summary": "Mock Analysis: Good content but missing strategic KPIs.",
            "suggested_tier": "MID",
            "bullets": ["Quantify achievements.", "Remove objective statement.", "Align with job target."],
            "gap_analysis": [
                {"category": "Impact", "finding": "Missing quantifiable metrics (e.g., revenue, savings)."},
                {"category": "Format", "finding": "Dense text blocks are hard to read."},
                {"category": "Keywords", "finding": "Missing key industry terms for this role."}
            ]
        }
    
    # Updated Prompt for Detailed Gap Analysis
    system_msg = """
    You are a strict, high-end Resume Auditor. Your job is to analyze resumes and sell the need for a professional rewrite.
    
    1. ANALYZE the resume text for specific weaknesses:
       - Passive language (e.g., "Responsible for" instead of "Led").
       - Lack of metrics (No $, %, or growth numbers).
       - Bad formatting (Dense blocks of text, lack of keywords).
       - Generic objective statements.
    
    2. SCORING:
       - Be strict. Average score should be 45-65.
       - Only give >75 if it is truly perfect (rare).
    
    3. GAP ANALYSIS (The most important part):
       - Provide 3 distinct, harsh, but true reasons why this resume will fail.
       - Be specific. Don't just say "Needs improvement." Say "Fails to quantify sales impact in 2023 role."
       - Use direct language: "Recruiters will skip this because..."

    4. TIER DETECTION:
       - Classify the candidate into one of these tiers based on experience:
         - ENTRY (0-2 years, recent grad)
         - MID (2-7 years, specialist)
         - SENIOR (7-12 years, team lead, manager)
         - EXEC (12+ years, Director/VP)
         - CSUITE (C-level, SVP, Founder)
    
    Output JSON format:
    {
        "score": (integer 0-100),
        "summary": (A 2-sentence summary of the resume's biggest failure),
        "suggested_tier": ("ENTRY" | "MID" | "SENIOR" | "EXEC" | "CSUITE"),
        "bullet_recommendations": [
            "Specific fix 1",
            "Specific fix 2",
            "Specific fix 3"
        ],
        "gap_analysis": [
            {
                "category": "Impact",
                "finding": "You list duties, not achievements. Example: You said 'Managed team' but didn't say how many people or what you delivered."
            },
            {
                "category": "ATS Compliance",
                "finding": "Your layout uses columns/tables that 40% of ATS systems cannot read, causing auto-rejection."
            },
            {
                "category": "Language",
                "finding": "Overuse of passive phrases like 'Helped with' weakens your authority."
            }
        ]
    }
    """
    
    chat = LlmChat(
        api_key=api_key,
        session_id=str(uuid.uuid4()),
        system_message=system_msg
    ).with_model("openai", "gpt-5.1")
    
    user_msg = UserMessage(text=f"Analyze this resume:\n\n{text[:12000]}")
    
    try:
        response = await chat.send_message(user_msg)
        
        # Robust response handling
        if hasattr(response, 'text'):
            content = response.text.strip()
        elif isinstance(response, str):
            content = response.strip()
        else:
            content = str(response).strip()

        # Clean markdown
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        import json
        data = json.loads(content)
        return {
            "score": data.get("score", 60),
            "summary": data.get("summary", "Analysis incomplete."),
            "suggested_tier": data.get("suggested_tier", "MID"),
            "bullets": data.get("bullet_recommendations", []),
            "gap_analysis": data.get("gap_analysis", [
                {"category": "General", "finding": "Could not generate detailed gaps."}
            ])
        }
    except Exception as e:
        logger.error(f"LLM Error: {e}")
        return {
            "score": 55,
            "summary": "Automated analysis failed. Manual review required.",
            "suggested_tier": "MID",
            "bullets": ["Resubmit for detailed analysis."],
            "gap_analysis": [
                {"category": "Error", "finding": "System could not process this file deeply."}
            ]
        }

# --- Routes ---

@api_router.get("/")
async def root():
    return {"message": "ResumeShortlist API Running"}

@api_router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename.lower()
    
    text = ""
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        text = extract_text_from_docx(content)
    else:
        try: text = content.decode("utf-8")
        except: raise HTTPException(status_code=400, detail="Unsupported file format")
            
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")
        
    analysis = await analyze_resume_text(text)
    
    upload_id = str(uuid.uuid4())
    await db.uploads.insert_one({
        "id": upload_id,
        "filename": file.filename,
        "timestamp": datetime.now(timezone.utc),
        "score": analysis["score"],
        "text_preview": text[:200]
    })
    
    return {
        "upload_id": upload_id,
        "filename": file.filename,
        **analysis
    }

@api_router.post("/checkout")
async def create_checkout_session(request: CheckoutRequest, req: Request):
    price_id = os.environ.get(f"PRICE_{request.price_key}")
    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid price tier")
    
    line_items = [{
        'price': price_id,
        'quantity': 1,
    }]

    # Add Interview Prep if requested
    if request.include_interview_prep:
        interview_price_id = os.environ.get("PRICE_INTERVIEW")
        if interview_price_id:
            line_items.append({
                'price': interview_price_id,
                'quantity': 1,
            })
    
    # Determine base URL dynamically if possible, else fallback to env
    base_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    if req.headers.get("origin"):
        base_url = req.headers.get("origin")
        
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{base_url}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{base_url}/results",
            metadata={
                "upload_id": request.upload_id,
                "tier": request.price_key,
                "email": request.email,
                "interview_prep": str(request.include_interview_prep)
            }
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        logger.error(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/verify-session")
async def verify_session(session_id: str = Form(...)):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == 'paid':
            # Save order to DB
            metadata = session.metadata or {}
            await db.orders.insert_one({
                "stripe_session_id": session_id,
                "amount": session.amount_total,
                "email": session.customer_details.email if session.customer_details else metadata.get('email'),
                "tier": metadata.get('tier'),
                "upload_id": metadata.get('upload_id'),
                "status": "paid_pending_review",
                "timestamp": datetime.now(timezone.utc)
            })
            return {"status": "paid", "email": session.customer_details.email}
        else:
            return {"status": "unpaid"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Session")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
