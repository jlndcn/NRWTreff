#!/usr/bin/env python3
"""
Seed 30 stock profiles with placeholder data for NRW Rotlicht Directory
"""
import os
import asyncio
import random
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from slugify import slugify
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "nrw_directory")

# Stock names (German/International)
NAMES = [
    "Luna", "Mia", "Sofia", "Emma", "Lara", "Sarah", "Nina", "Lisa", "Julia", "Anna",
    "Lea", "Marie", "Laura", "Michelle", "Vanessa", "Jessica", "Melanie", "Sandra", "Tina", "Katrin",
    "Elena", "Isabella", "Sophia", "Victoria", "Diana", "Natalia", "Alina", "Kira", "Maya", "Zoe"
]

# Cities from NRW
CITIES = [
    "koeln", "duesseldorf", "dortmund", "essen", "duisburg", "bochum",
    "wuppertal", "bielefeld", "bonn", "muenster", "aachen", "moenchengladbach"
]

# Categories
CATEGORIES = ["escort", "massage", "neu", "verifiziert", "heute-verfuegbar"]

# Descriptions
SHORT_DESCS = [
    "Diskrete Treffen für anspruchsvolle Gentlemen",
    "Erotische Massagen mit Happy End",
    "Leidenschaftliche Stunden zu zweit",
    "Exklusive Begleitung für besondere Momente",
    "Verwöhnprogramm der Extraklasse",
    "Sinnliche Entspannung auf höchstem Niveau",
    "Unvergessliche Momente voller Erotik",
    "Stilvolle Begleitung für jeden Anlass",
    "Zärtliche Momente in diskreter Atmosphäre",
    "Erotik pur - individuell & diskret"
]

# Phone numbers (dummy)
PHONE_PREFIXES = ["+49 170", "+49 171", "+49 172", "+49 173", "+49 174", "+49 175"]

async def generate_unique_slug(base_slug, collection, attempt=0):
    slug = f"{base_slug}-{attempt}" if attempt > 0 else base_slug
    existing = await collection.find_one({"slug": slug})
    if existing:
        return await generate_unique_slug(base_slug, collection, attempt + 1)
    return slug

async def seed_profiles():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🌱 Seeding 30 stock profiles...")
    
    # Get existing cities
    cities = await db.cities.find().to_list(100)
    if not cities:
        print("❌ No cities found. Please seed cities first.")
        return
    
    city_map = {c["slug"]: c for c in cities}
    
    created_count = 0
    
    for i in range(30):
        name = NAMES[i]
        city_slug = random.choice(CITIES)
        
        if city_slug not in city_map:
            city_slug = list(city_map.keys())[0]  # Fallback
        
        city = city_map[city_slug]
        base_slug = slugify(f"{name}-{city_slug}")
        slug = await generate_unique_slug(base_slug, db.profiles)
        
        age = random.randint(21, 35)
        categories = random.sample(CATEGORIES, k=random.randint(2, 4))
        
        # Random contact info
        phone = f"{random.choice(PHONE_PREFIXES)} {random.randint(1000000, 9999999)}"
        has_whatsapp = random.random() > 0.3
        has_telegram = random.random() > 0.4
        has_maps = random.random() > 0.5
        
        contact = {
            "phone": phone,
            "whatsapp": phone if has_whatsapp else None,
            "telegram": f"https://t.me/{name.lower()}{random.randint(10, 99)}" if has_telegram else None,
            "maps_url": f"https://maps.google.com/?q={city['name']},Germany" if has_maps else None,
            "show_phone": True,
            "show_whatsapp": True,
            "show_telegram": True
        }
        
        addons = {
            "whatsapp_enabled": has_whatsapp and random.random() > 0.3,
            "telegram_enabled": has_telegram and random.random() > 0.3,
            "maps_enabled": has_maps and random.random() > 0.4
        }
        
        # Random dates in the past week
        days_ago = random.randint(0, 7)
        created_at = datetime.utcnow() - timedelta(days=days_ago)
        
        profile = {
            "name": name,
            "age": age,
            "slug": slug,
            "city_slug": city_slug,
            "region_slug": city.get("region_slug", ""),
            "categories": categories,
            "short_desc": random.choice(SHORT_DESCS),
            "description": f"Hallo, ich bin {name}, {age} Jahre alt und freue mich auf diskrete Treffen in {city['name']}. Ich biete dir eine unvergessliche Zeit voller Leidenschaft und Erotik. Kontaktiere mich für weitere Details.",
            "contact": contact,
            "addons": addons,
            "photos": [],
            "status": "active",
            "featured": random.random() > 0.85,
            "premium": random.random() > 0.90,
            "order": 0,
            "height": random.randint(160, 180),
            "weight": random.randint(50, 70),
            "nationality": random.choice(["Deutsch", "International", "Osteuropäisch"]),
            "languages": ["Deutsch", "Englisch"],
            "availability": "Nach Vereinbarung",
            "is_new": "neu" in categories,
            "verified": "verifiziert" in categories,
            "view_count": 0,
            "seo_title": f"{name}, {age} J. in {city['name']} – Diskrete Begleitung",
            "seo_description": f"Treffe {name} ({age}) in {city['name']}. {random.choice(SHORT_DESCS)}",
            "created_at": created_at,
            "updated_at": created_at,
            "last_push_at": None,
            "push_package": {
                "active": False,
                "daily_time": None,
                "start_at": None,
                "end_at": None,
                "last_run_at": None,
                "timezone": "Europe/Berlin"
            }
        }
        
        await db.profiles.insert_one(profile)
        created_count += 1
        print(f"✅ Created profile: {name} ({slug}) in {city['name']}")
    
    print(f"\n🎉 Successfully created {created_count} profiles!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_profiles())
