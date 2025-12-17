import stripe
import os
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

products_to_create = [
    {"name": "Entry Level Resume Rebuild", "amount": 5000, "id_key": "PRICE_ENTRY"},
    {"name": "Mid Level Resume Rebuild", "amount": 10000, "id_key": "PRICE_MID"},
    {"name": "Senior Level Resume Rebuild", "amount": 20000, "id_key": "PRICE_SENIOR"},
    {"name": "Executive Level Resume Rebuild", "amount": 40000, "id_key": "PRICE_EXEC"},
    {"name": "C-Suite Level Resume Rebuild", "amount": 80000, "id_key": "PRICE_CSUITE"},
    {"name": "Executive Interview Prep (1 Hour)", "amount": 10000, "id_key": "PRICE_INTERVIEW"},
]

print("--- STRIPE SETUP ---")
for p in products_to_create:
    try:
        # Check if product exists roughly by name to avoid dupes if run multiple times
        # (For simplicity in this script, we just create a new one. In prod, you'd check.)
        product = stripe.Product.create(name=p["name"])
        price = stripe.Price.create(
            unit_amount=p["amount"],
            currency="usd",
            product=product.id,
        )
        print(f"{p['id_key']}='{price.id}'")
    except Exception as e:
        print(f"Error creating {p['name']}: {e}")
