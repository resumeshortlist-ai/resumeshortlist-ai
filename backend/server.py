from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request, Response
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
import smtplib
import ssl
from email.message import EmailMessage

import pypdf
import docx
import stripe
from openai import OpenAI
import boto3


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("resumeshortlist-backend")

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

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

app = FastAPI()

VERCEL_PREVIEW_REGEX = r"^https:\/\/resumeshortlist(?:-ai)?(?:-[a-z0-9]+-shortlistais-projects)?\.vercel\.app$"
cors_raw = os.environ.get("CORS_ORIGINS", "")
allow_origins = [o.strip() for o in cors_raw.split(",") if o.strip()]
for local in ["http://localhost:3000", "http://127.0.0.1:3000"]:
    if local not in allow_origins:
        allow_origins.append(local)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_origin_regex=VERCEL_PREVIEW_REGEX,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")


class CheckoutRequest(BaseModel):
    price_key: str
    include_interview_prep: bool = False
    upload_id: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None


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
            "Reduce density: 3–5 bullets per role, one line each where possible.",
        ],
        "gap_analysis": [
            {"category": "Impact", "finding": "The resume lists responsibilities more than quantified outcomes."},
            {"category": "Targeting", "finding": "Keywords and role signals are too broad for recruiter filtering."},
            {"category": "Clarity", "finding": "Bullets are dense; key wins are not immediately scannable."},
        ],
    }


def _price_id_for_key(key: str) -> Optional[str]:
    normalized = (key or "").strip().upper()
    return os.environ.get(f"STRIPE_PRICE_{normalized}") or os.environ.get(f"PRICE_{normalized}")


def _interview_price_id() -> Optional[str]:
    return os.environ.get("STRIPE_PRICE_INTERVIEW") or os.environ.get("PRICE_INTERVIEW")


def _openai_analyze(text: str) -> Dict[str, Any]:
    if not openai_client:
        return _fallback_analysis()

    system_msg = """
Return ONLY valid JSON:
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
Be strict. Typical score 45–65.
""".strip()

    user_msg = f"Analyze this resume:\n\n{text[:12000]}"

    for attempt in range(3):
        try:
            resp = openai_client.chat.completions.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[{"role": "system", "content": system_msg}, {"role": "user", "content": user_msg}],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            data = json.loads(resp.choices[0].message.content or "{}")
            score = int(data.get("score", 60))
            score = max(0, min(100, score))
            bullets = data.get("bullet_recommendations") or []
            gaps = data.get("gap_analysis") or []
            return {
                "score": score,
                "summary": data.get("summary", "Analysis incomplete."),
                "suggested_tier": (data.get("suggested_tier") or "MID").strip().upper(),
                "bullet_recommendations": bullets[:4] if isinstance(bullets, list) else [],
                "gap_analysis": gaps[:3] if isinstance(gaps, list) else [],
            }
        except Exception as e:
            logger.error(f"OpenAI error (attempt {attempt+1}/3): {e}")
            time.sleep(0.7 * (attempt + 1))

    return {
        "score": 55,
        "summary": "Automated analysis failed. Please try again in a minute.",
        "suggested_tier": "MID",
        "bullet_recommendations": ["Resubmit for detailed analysis.", "Ensure the file is text-readable (not scanned)."],
        "gap_analysis": [{"category": "Error", "finding": "System could not process this file deeply."}],
    }


def _serialize_order(order: Dict[str, Any]) -> Dict[str, Any]:
    if not order:
        return {}
    customer = order.get("customer") or {}
    payment = order.get("payment") or {}
    return {
        "upload_id": order.get("upload_id"),
        "status": order.get("status"),
        "tier": order.get("tier"),
        "score": order.get("score"),
        "created_at": order.get("created_at").isoformat() if order.get("created_at") else None,
        "original_filename": order.get("original_filename"),
        "revised_filename": order.get("revised_filename"),
        "original_r2_key": order.get("original_r2_key"),
        "revised_r2_key": order.get("revised_r2_key"),
        "customer": {
            "name": customer.get("name"),
            "email": customer.get("email"),
            "phone": customer.get("phone"),
        },
        "payment": {
            "session_id": payment.get("session_id"),
            "status": payment.get("status"),
            "paid_at": payment.get("paid_at").isoformat() if payment.get("paid_at") else None,
        },
    }


def _is_full_name(value: str) -> bool:
    parts = [part for part in (value or "").strip().split() if part]
    return len(parts) >= 2


def _is_valid_email(value: str) -> bool:
    if not value:
        return False
    value = value.strip()
    if "@" not in value:
        return False
    local, _, domain = value.partition("@")
    return bool(local) and "." in domain


def _smtp_config() -> Dict[str, Any]:
    host = os.environ.get("SMTP_HOST")
    if not host:
        return {}
    return {
        "host": host,
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "username": os.environ.get("SMTP_USER"),
        "password": os.environ.get("SMTP_PASSWORD"),
        "sender": os.environ.get("SMTP_FROM") or os.environ.get("SMTP_USER"),
    }


def _r2_config() -> Dict[str, Any]:
    bucket = os.environ.get("R2_BUCKET")
    account_id = os.environ.get("R2_ACCOUNT_ID")
    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
    if not all([bucket, account_id, access_key, secret_key]):
        return {}
    endpoint = os.environ.get("R2_ENDPOINT") or f"https://{account_id}.r2.cloudflarestorage.com"
    return {
        "bucket": bucket,
        "endpoint": endpoint,
        "access_key": access_key,
        "secret_key": secret_key,
    }


def _r2_client():
    config = _r2_config()
    if not config:
        return None
    return boto3.client(
        "s3",
        endpoint_url=config["endpoint"],
        aws_access_key_id=config["access_key"],
        aws_secret_access_key=config["secret_key"],
        region_name="auto",
    )


def _r2_key(upload_id: str, filename: str, variant: str) -> str:
    extension = ""
    if filename and "." in filename:
        extension = filename.split(".")[-1].lower()
    suffix = f".{extension}" if extension else ""
    return f"uploads/{upload_id}/{variant}{suffix}"


def _r2_upload_bytes(key: str, content: bytes, content_type: str) -> None:
    client = _r2_client()
    config = _r2_config()
    if not client or not config:
        raise RuntimeError("R2 is not configured. Set R2_BUCKET, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.")
    client.put_object(Bucket=config["bucket"], Key=key, Body=content, ContentType=content_type)


def _r2_download_bytes(key: str) -> bytes:
    client = _r2_client()
    config = _r2_config()
    if not client or not config:
        raise RuntimeError("R2 is not configured. Set R2_BUCKET, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.")
    response = client.get_object(Bucket=config["bucket"], Key=key)
    return response["Body"].read()


def _send_revision_email(
    *,
    recipient: str,
    customer_name: str,
    subject: str,
    body: str,
    attachment_name: str,
    attachment_bytes: bytes,
    attachment_type: str,
) -> None:
    config = _smtp_config()
    if not config:
        raise RuntimeError("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM.")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = config["sender"]
    msg["To"] = recipient
    msg.set_content(body)
    msg.add_attachment(attachment_bytes, maintype=attachment_type.split("/")[0], subtype=attachment_type.split("/")[1], filename=attachment_name)

    context = ssl.create_default_context()
    with smtplib.SMTP(config["host"], config["port"]) as server:
        server.starttls(context=context)
        if config.get("username") and config.get("password"):
            server.login(config["username"], config["password"])
        server.send_message(msg)


@api_router.get("/health")
async def health():
    return {"ok": True, "db": db is not None, "openai": bool(openai_client), "stripe": bool(stripe.api_key)}


@api_router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), name: str = Form(...), email: str = Form(...)):
    name_value = (name or "").strip()
    email_value = (email or "").strip()
    if not _is_full_name(name_value):
        raise HTTPException(status_code=400, detail="Please provide your first and last name.")
    if not _is_valid_email(email_value):
        raise HTTPException(status_code=400, detail="Please provide a valid email address.")

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
            original_key = _r2_key(upload_id, file.filename or "resume", "original")
            _r2_upload_bytes(original_key, content, file.content_type or "application/octet-stream")
            await db.resume_requests.insert_one(
                {
                    "upload_id": upload_id,
                    "created_at": datetime.now(timezone.utc),
                    "status": "analysis_complete",
                    "tier": analysis.get("suggested_tier"),
                    "score": analysis.get("score"),
                    "original_filename": file.filename,
                    "original_content_type": file.content_type or "application/octet-stream",
                    "original_r2_key": original_key,
                    "customer": {"name": name_value, "email": email_value},
                    "analysis": analysis,
                }
            )
        except Exception as e:
            logger.error(f"DB insert failed (resume_requests): {e}")

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
    if not stripe.api_key or not str(stripe.api_key).startswith("sk_"):
        raise HTTPException(status_code=500, detail="Stripe not configured correctly (STRIPE_SECRET_KEY must be sk_...)")

    name_value = (request.name or "").strip()
    email_value = (request.email or "").strip()
    if not _is_full_name(name_value):
        raise HTTPException(status_code=400, detail="Please provide your first and last name.")
    if not _is_valid_email(email_value):
        raise HTTPException(status_code=400, detail="Please provide a valid email address.")

    price_id = _price_id_for_key(request.price_key)
    if not price_id or not str(price_id).startswith("price_"):
        raise HTTPException(status_code=400, detail=f"Missing/invalid price for tier {request.price_key}. Expected price_...")

    line_items = [{"price": price_id, "quantity": 1}]

    if request.include_interview_prep:
        interview_price_id = _interview_price_id()
        if not interview_price_id or not str(interview_price_id).startswith("price_"):
            raise HTTPException(status_code=400, detail="Interview prep selected but STRIPE_PRICE_INTERVIEW is missing/invalid")
        line_items.append({"price": interview_price_id, "quantity": 1})

    base_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    if req.headers.get("origin"):
        base_url = req.headers.get("origin")

    try:
        if db and request.upload_id:
            await db.resume_requests.update_one(
                {"upload_id": request.upload_id},
                {
                    "$set": {
                        "customer": {
                            "name": name_value,
                            "email": email_value,
                            "phone": request.phone,
                        },
                        "tier": (request.price_key or "").upper(),
                        "status": "checkout_started",
                    }
                },
            )
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            success_url=f"{base_url}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{base_url}/results",
            client_reference_id=request.upload_id or "",
            metadata={
                "upload_id": request.upload_id or "",
                "tier": (request.price_key or "").upper(),
                "email": email_value,
                "name": name_value,
                "phone": request.phone or "",
                "interview_prep": str(bool(request.include_interview_prep)),
            },
        )
        return {"checkout_url": session.url}
    except Exception as e:
        # THIS is what you need to see
        logger.exception(f"Stripe checkout failed: {e}")
        raise HTTPException(status_code=500, detail=f"Stripe checkout failed: {str(e)}")


@api_router.post("/verify-session")
async def verify_session(session_id: str = Form(...)):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == "paid":
            if db and session.client_reference_id:
                await db.resume_requests.update_one(
                    {"upload_id": session.client_reference_id},
                    {
                        "$set": {
                            "payment": {
                                "session_id": session_id,
                                "status": "paid",
                                "paid_at": datetime.now(timezone.utc),
                            },
                            "status": "paid",
                        }
                    },
                )
            return {"status": "paid", "email": (session.customer_details.email if session.customer_details else None)}
        return {"status": "unpaid"}
    except Exception as e:
        logger.error(f"Verify session error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid Session: {str(e)}")


@api_router.get("/admin/orders")
async def admin_orders():
    if not db:
        raise HTTPException(status_code=503, detail="Database not configured")
    orders = await db.resume_requests.find().sort("created_at", -1).to_list(200)
    return {"orders": [_serialize_order(order) for order in orders]}


@api_router.get("/admin/orders/{upload_id}/file")
async def admin_download_file(upload_id: str, file_type: str = "original"):
    if not db:
        raise HTTPException(status_code=503, detail="Database not configured")

    order = await db.resume_requests.find_one({"upload_id": upload_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    name_field = "original_filename" if file_type == "original" else "revised_filename"
    content_field = "original_content_type" if file_type == "original" else "revised_content_type"
    key_field = "original_r2_key" if file_type == "original" else "revised_r2_key"

    r2_key = order.get(key_field)
    if not r2_key:
        raise HTTPException(status_code=404, detail="File not available")

    filename = order.get(name_field) or f"{upload_id}-{file_type}.pdf"
    content_type = order.get(content_field) or "application/octet-stream"
    try:
        file_bytes = _r2_download_bytes(r2_key)
    except Exception as e:
        logger.error(f"R2 download failed: {e}")
        raise HTTPException(status_code=500, detail="Unable to download file")
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return Response(content=file_bytes, media_type=content_type, headers=headers)


@api_router.post("/admin/orders/{upload_id}/revised")
async def admin_upload_revision(upload_id: str, file: UploadFile = File(...)):
    if not db:
        raise HTTPException(status_code=503, detail="Database not configured")

    content = await file.read()
    revised_key = _r2_key(upload_id, file.filename or "revised", "revised")
    try:
        _r2_upload_bytes(revised_key, content, file.content_type or "application/octet-stream")
    except Exception as e:
        logger.error(f"R2 upload failed: {e}")
        raise HTTPException(status_code=500, detail="Unable to upload revised resume")
    result = await db.resume_requests.update_one(
        {"upload_id": upload_id},
        {
            "$set": {
                "revised_filename": file.filename,
                "revised_content_type": file.content_type or "application/octet-stream",
                "revised_r2_key": revised_key,
                "revised_uploaded_at": datetime.now(timezone.utc),
                "status": "revised_ready",
            }
        },
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"ok": True}


@api_router.post("/admin/orders/{upload_id}/send-revision")
async def admin_send_revision(upload_id: str):
    if not db:
        raise HTTPException(status_code=503, detail="Database not configured")

    order = await db.resume_requests.find_one({"upload_id": upload_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    customer = order.get("customer") or {}
    recipient = customer.get("email")
    if not recipient:
        raise HTTPException(status_code=400, detail="Customer email missing")

    revised_key = order.get("revised_r2_key")
    if not revised_key:
        raise HTTPException(status_code=400, detail="Revised resume not uploaded")

    customer_name = customer.get("name") or "there"
    filename = order.get("revised_filename") or f"{upload_id}-revised.pdf"
    content_type = order.get("revised_content_type") or "application/octet-stream"
    try:
        revised_file = _r2_download_bytes(revised_key)
    except Exception as e:
        logger.error(f"R2 download failed: {e}")
        raise HTTPException(status_code=500, detail="Unable to download revised resume")

    subject = "Your revised resume is ready"
    body = (
        f"Hi {customer_name},\n\n"
        "Your revised resume is attached. If you have any questions or want additional edits, reply to this email.\n\n"
        "Best,\nResume Shortlist Team"
    )

    try:
        _send_revision_email(
            recipient=recipient,
            customer_name=customer_name,
            subject=subject,
            body=body,
            attachment_name=filename,
            attachment_bytes=revised_file,
            attachment_type=content_type,
        )
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        raise HTTPException(status_code=500, detail=f"Email send failed: {str(e)}")

    await db.resume_requests.update_one(
        {"upload_id": upload_id},
        {"$set": {"status": "delivered", "delivered_at": datetime.now(timezone.utc)}},
    )

    return {"ok": True}


app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    if mongo_client:
        mongo_client.close()
