import os
import uuid
import io
import bcrypt
from pathlib import Path
from datetime import datetime, timedelta, time as dt_time
from typing import Optional, List, Any, Dict
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Request, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response, JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from bson import ObjectId
from jose import jwt, JWTError
from PIL import Image
from slugify import slugify
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import pytz

load_dotenv()

# ─── Config ───────────────────────────────────────────────────
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "nrw_escort")
JWT_SECRET = os.environ.get("JWT_SECRET", "nrw-rotlicht-2025-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24
SITE_URL = os.environ.get("SITE_URL", "https://direct-connect-32.preview.emergentagent.com")
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ─── App Setup ────────────────────────────────────────────────
app = FastAPI(title="NRW Rotlicht Directory")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── DB Connection ────────────────────────────────────────────
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ─── Scheduler Setup ──────────────────────────────────────────
scheduler = AsyncIOScheduler(timezone=pytz.timezone('Europe/Berlin'))

# ─── Static Files ─────────────────────────────────────────────
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# ─── Auth ─────────────────────────────────────────────────────
security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_token(username: str) -> str:
    exp = datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)
    payload = {"sub": username, "exp": exp}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def require_admin(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Try cookie first (new secure method)
    token = request.cookies.get("admin_token")
    
    # Fallback to Authorization header for backwards compatibility
    if not token and credentials:
        token = credentials.credentials
    
    if not token:
        raise HTTPException(status_code=401, detail="Nicht authentifiziert")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Ungültiger Token")
        user = await db.admin_users.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=401, detail="Admin nicht gefunden")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Ungültiger Token")

# ─── Helpers ──────────────────────────────────────────────────
def serialize_doc(doc: dict) -> dict:
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == "_id":
            result["id"] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [
                serialize_doc(v) if isinstance(v, dict)
                else (str(v) if isinstance(v, ObjectId) else v)
                for v in value
            ]
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        else:
            result[key] = value
    return result

async def generate_unique_slug(base_slug: str, collection_name: str, exclude_id: str = None) -> str:
    slug = base_slug
    counter = 1
    col = db[collection_name]
    while True:
        query = {"slug": slug}
        if exclude_id:
            query["_id"] = {"$ne": ObjectId(exclude_id)}
        existing = await col.find_one(query)
        if not existing:
            break
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug

async def process_image(file_bytes: bytes, max_w: int = 1200, max_h: int = 1600) -> str:
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    w, h = img.size
    if w > max_w or h > max_h:
        ratio = min(max_w / w, max_h / h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)
    filename = f"{uuid.uuid4().hex}.webp"
    filepath = UPLOAD_DIR / filename
    buffer = io.BytesIO()
    img.save(buffer, format="WEBP", quality=85, method=4)
    buffer.seek(0)
    with open(filepath, "wb") as f:
        f.write(buffer.read())
    return filename

# ─── Pydantic Models ──────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class ContactInfo(BaseModel):
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    telegram: Optional[str] = None
    maps_url: Optional[str] = None
    show_phone: bool = True
    show_whatsapp: bool = True
    show_telegram: bool = True

class ProfileAddons(BaseModel):
    whatsapp_enabled: bool = False
    telegram_enabled: bool = False
    maps_enabled: bool = False

class ProfileCreate(BaseModel):
    name: str
    age: int
    city_slug: str
    categories: List[str] = []
    description: Optional[str] = None
    short_desc: Optional[str] = None
    contact: Optional[ContactInfo] = None
    addons: Optional[ProfileAddons] = None
    status: str = "pending"
    featured: bool = False
    premium: bool = False
    order: int = 0
    height: Optional[int] = None
    weight: Optional[int] = None
    nationality: Optional[str] = None
    languages: List[str] = []
    availability: Optional[str] = None
    is_new: bool = True
    verified: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class ProfileUpdate(ProfileCreate):
    pass

class PhotoAltUpdate(BaseModel):
    alt: str

class PhotoReorderRequest(BaseModel):
    photo_ids: List[str]

class PushPackage(BaseModel):
    active: bool = False
    daily_time: Optional[str] = None  # Format: "HH:MM" (24h)
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    last_run_at: Optional[datetime] = None
    timezone: str = "Europe/Berlin"

class PushPackageUpdate(BaseModel):
    active: bool
    daily_time: Optional[str] = None  # Format: "HH:MM"
    duration_days: int = 30

class ApplicationCreate(BaseModel):
    name: str
    age: int
    city: str
    contact_info: str
    description: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class CityUpdate(BaseModel):
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    description: Optional[str] = None

# ─── Seed Data ────────────────────────────────────────────────
REGIONS_DATA = [
    {
        "name": "Ruhrgebiet",
        "slug": "ruhrgebiet",
        "cities": ["dortmund", "essen", "duisburg", "bochum", "gelsenkirchen", "oberhausen", "hagen", "hamm", "herne", "recklinghausen"],
        "description": "Das Ruhrgebiet ist die größte Metropolregion in NRW mit über 5 Millionen Einwohnern.",
        "seo_title": "Escort & Begleitung im Ruhrgebiet – Dortmund, Essen, Bochum & mehr",
        "seo_description": "Diskrete Begleitung im Ruhrgebiet. Profile aus Dortmund, Essen, Duisburg, Bochum und weiteren Ruhrgebietsstädten."
    },
    {
        "name": "Rheinland",
        "slug": "rheinland",
        "cities": ["koeln", "duesseldorf", "bonn", "aachen", "krefeld", "moenchengladbach", "leverkusen", "solingen", "remscheid", "bergisch-gladbach", "wuppertal"],
        "description": "Das Rheinland umfasst die bedeutendsten Städte entlang des Rheins in NRW.",
        "seo_title": "Escort & Begleitung im Rheinland – Köln, Düsseldorf, Bonn & mehr",
        "seo_description": "Diskrete Begleitung im Rheinland. Profile aus Köln, Düsseldorf, Bonn, Aachen und weiteren Städten."
    },
    {
        "name": "Ostwestfalen-Lippe",
        "slug": "ostwestfalen-lippe",
        "cities": ["bielefeld", "paderborn"],
        "description": "Ostwestfalen-Lippe (OWL) ist eine Region im Osten von NRW.",
        "seo_title": "Escort & Begleitung in Ostwestfalen-Lippe – Bielefeld & Paderborn",
        "seo_description": "Diskrete Begleitung in Ostwestfalen-Lippe. Profile aus Bielefeld und Paderborn."
    },
    {
        "name": "Niederrhein",
        "slug": "niederrhein",
        "cities": ["duisburg", "krefeld", "moenchengladbach", "oberhausen"],
        "description": "Der Niederrhein ist eine Region entlang des Rheins im Westen von NRW.",
        "seo_title": "Escort & Begleitung am Niederrhein – Krefeld, Duisburg & mehr",
        "seo_description": "Diskrete Begleitung am Niederrhein. Profile aus Krefeld, Duisburg, Mönchengladbach und Oberhausen."
    },
    {
        "name": "Sauerland",
        "slug": "sauerland",
        "cities": ["hagen", "siegen"],
        "description": "Das Sauerland ist eine hügelige Region im Süden des Ruhrgebiets.",
        "seo_title": "Escort & Begleitung im Sauerland – Hagen & Siegen",
        "seo_description": "Diskrete Begleitung im Sauerland. Profile aus Hagen und Siegen."
    }
]

CITIES_DATA = [
    {"name": "Köln", "slug": "koeln", "region_slug": "rheinland"},
    {"name": "Düsseldorf", "slug": "duesseldorf", "region_slug": "rheinland"},
    {"name": "Dortmund", "slug": "dortmund", "region_slug": "ruhrgebiet"},
    {"name": "Essen", "slug": "essen", "region_slug": "ruhrgebiet"},
    {"name": "Duisburg", "slug": "duisburg", "region_slug": "ruhrgebiet"},
    {"name": "Bochum", "slug": "bochum", "region_slug": "ruhrgebiet"},
    {"name": "Wuppertal", "slug": "wuppertal", "region_slug": "rheinland"},
    {"name": "Bonn", "slug": "bonn", "region_slug": "rheinland"},
    {"name": "Münster", "slug": "muenster", "region_slug": "ruhrgebiet"},
    {"name": "Bielefeld", "slug": "bielefeld", "region_slug": "ostwestfalen-lippe"},
    {"name": "Aachen", "slug": "aachen", "region_slug": "rheinland"},
    {"name": "Mönchengladbach", "slug": "moenchengladbach", "region_slug": "rheinland"},
    {"name": "Gelsenkirchen", "slug": "gelsenkirchen", "region_slug": "ruhrgebiet"},
    {"name": "Krefeld", "slug": "krefeld", "region_slug": "rheinland"},
    {"name": "Oberhausen", "slug": "oberhausen", "region_slug": "ruhrgebiet"},
    {"name": "Hagen", "slug": "hagen", "region_slug": "ruhrgebiet"},
    {"name": "Hamm", "slug": "hamm", "region_slug": "ruhrgebiet"},
    {"name": "Leverkusen", "slug": "leverkusen", "region_slug": "rheinland"},
    {"name": "Solingen", "slug": "solingen", "region_slug": "rheinland"},
    {"name": "Herne", "slug": "herne", "region_slug": "ruhrgebiet"},
    {"name": "Paderborn", "slug": "paderborn", "region_slug": "ostwestfalen-lippe"},
    {"name": "Recklinghausen", "slug": "recklinghausen", "region_slug": "ruhrgebiet"},
    {"name": "Remscheid", "slug": "remscheid", "region_slug": "rheinland"},
    {"name": "Bergisch Gladbach", "slug": "bergisch-gladbach", "region_slug": "rheinland"},
    {"name": "Siegen", "slug": "siegen", "region_slug": "sauerland"}
]

CATEGORIES_DATA = [
    {"name": "Neu", "slug": "neu", "description": "Neu auf der Plattform", "icon": "sparkles", "color": "#ff2244", "sort_order": 0},
    {"name": "Heute verfügbar", "slug": "heute-verfuegbar", "description": "Heute buchbar", "icon": "calendar", "color": "#2bd576", "sort_order": 1},
    {"name": "Verifiziert", "slug": "verifiziert", "description": "Verifiziertes Profil", "icon": "shield-check", "color": "#4fa3e0", "sort_order": 2},
    {"name": "Top Profil", "slug": "top-profil", "description": "Top bewertetes Profil", "icon": "crown", "color": "#ffb020", "sort_order": 3},
    {"name": "Eigene Location", "slug": "eigene-location", "description": "Empfängt in eigener Location", "icon": "home", "color": "#b7b7b7", "sort_order": 4},
    {"name": "Hausbesuche", "slug": "hausbesuche", "description": "Kommt zu dir nach Hause", "icon": "door-open", "color": "#b7b7b7", "sort_order": 5},
    {"name": "Hotelbesuche", "slug": "hotelbesuche", "description": "Kommt ins Hotel", "icon": "building", "color": "#b7b7b7", "sort_order": 6},
    {"name": "Escort", "slug": "escort", "description": "Diskreter Escort-Service", "icon": "heart", "color": "#d4000f", "sort_order": 7},
    {"name": "Freizeitbegleitung", "slug": "freizeitbegleitung", "description": "Freizeitbegleitung & Events", "icon": "coffee", "color": "#b7b7b7", "sort_order": 8},
    {"name": "Massage", "slug": "massage", "description": "Massageangebote", "icon": "hand", "color": "#b7b7b7", "sort_order": 9},
    {"name": "Wellness", "slug": "wellness", "description": "Wellness & Entspannung", "icon": "leaf", "color": "#2bd576", "sort_order": 10},
    {"name": "Studentisch", "slug": "studentisch", "description": "Studentinnen", "icon": "graduation-cap", "color": "#b7b7b7", "sort_order": 11},
    {"name": "Reif", "slug": "reif", "description": "Reife Damen ab 35", "icon": "award", "color": "#b7b7b7", "sort_order": 12},
    {"name": "International", "slug": "international", "description": "Internationale Damen", "icon": "globe", "color": "#b7b7b7", "sort_order": 13}
]

# ─── API Endpoints ────────────────────────────────────────────

@app.get("/api/")
async def root():
    return {"message": "NRW Rotlicht Directory API", "status": "online"}

# ─── Auth Endpoints ───────────────────────────────────────────
@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = await db.admin_users.find_one({"username": req.username})
    if not user:
        raise HTTPException(status_code=401, detail="Ungültige Zugangsdaten")
    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Ungültige Zugangsdaten")
    token = create_token(req.username)
    response = JSONResponse({"success": True, "username": req.username})
    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=JWT_EXPIRE_HOURS * 3600
    )
    return response

@app.get("/api/auth/verify")
async def verify_token(admin: str = Depends(require_admin)):
    return {"valid": True, "username": admin}

@app.post("/api/auth/logout")
async def logout():
    response = JSONResponse({"success": True})
    response.delete_cookie(key="admin_token")
    return response

# ─── Seed Endpoint ────────────────────────────────────────────
@app.post("/api/seed")
async def seed_data():
    seeded = {}

    # Admin user
    existing_admin = await db.admin_users.find_one({"username": "Test123"})
    if not existing_admin:
        await db.admin_users.insert_one({
            "username": "Test123",
            "password_hash": hash_password("Test123"),
            "created_at": datetime.utcnow()
        })
        seeded["admin"] = "created"
    else:
        seeded["admin"] = "exists"

    # Regions
    region_count = 0
    for region in REGIONS_DATA:
        existing = await db.regions.find_one({"slug": region["slug"]})
        if not existing:
            await db.regions.insert_one({**region, "created_at": datetime.utcnow()})
            region_count += 1
    seeded["regions"] = region_count

    # Cities
    city_count = 0
    for city in CITIES_DATA:
        existing = await db.cities.find_one({"slug": city["slug"]})
        if not existing:
            seo_title = f"Escort & Begleitung in {city['name']} – Diskrete Profile"
            seo_desc = f"Diskrete Begleitung in {city['name']}. Finde passende Profile für Escort, Massage und mehr in {city['name']}, NRW."
            await db.cities.insert_one({
                **city,
                "description": f"Begleitung und Escort in {city['name']}, NRW.",
                "seo_title": seo_title,
                "seo_description": seo_desc,
                "profile_count": 0,
                "sort_order": CITIES_DATA.index(city),
                "created_at": datetime.utcnow()
            })
            city_count += 1
    seeded["cities"] = city_count

    # Categories
    cat_count = 0
    for cat in CATEGORIES_DATA:
        existing = await db.categories.find_one({"slug": cat["slug"]})
        if not existing:
            await db.categories.insert_one({**cat, "created_at": datetime.utcnow()})
            cat_count += 1
    seeded["categories"] = cat_count

    return {"status": "ok", "seeded": seeded}

# ─── Cities Endpoints ─────────────────────────────────────────
@app.get("/api/cities")
async def get_cities():
    cities = await db.cities.find().sort("sort_order", 1).to_list(100)
    # Add profile counts
    for city in cities:
        count = await db.profiles.count_documents({"city_slug": city["slug"], "status": "active"})
        city["profile_count"] = count
    return [serialize_doc(c) for c in cities]

@app.get("/api/cities/{slug}")
async def get_city(slug: str):
    city = await db.cities.find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="Stadt nicht gefunden")
    count = await db.profiles.count_documents({"city_slug": slug, "status": "active"})
    city["profile_count"] = count
    return serialize_doc(city)

@app.put("/api/cities/{city_id}")
async def update_city(city_id: str, data: CityUpdate, _: str = Depends(require_admin)):
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Keine Daten zum Aktualisieren")
    await db.cities.update_one({"_id": ObjectId(city_id)}, {"$set": update_data})
    city = await db.cities.find_one({"_id": ObjectId(city_id)})
    return serialize_doc(city)

# ─── Regions Endpoints ────────────────────────────────────────
@app.get("/api/regions")
async def get_regions():
    regions = await db.regions.find().sort("name", 1).to_list(20)
    return [serialize_doc(r) for r in regions]

@app.get("/api/regions/{slug}")
async def get_region(slug: str):
    region = await db.regions.find_one({"slug": slug})
    if not region:
        raise HTTPException(status_code=404, detail="Region nicht gefunden")
    return serialize_doc(region)

# ─── Categories Endpoints ─────────────────────────────────────
@app.get("/api/categories")
async def get_categories():
    cats = await db.categories.find().sort("sort_order", 1).to_list(50)
    return [serialize_doc(c) for c in cats]

@app.get("/api/categories/{slug}")
async def get_category(slug: str):
    cat = await db.categories.find_one({"slug": slug})
    if not cat:
        raise HTTPException(status_code=404, detail="Kategorie nicht gefunden")
    return serialize_doc(cat)

# ─── Profiles Endpoints ───────────────────────────────────────
@app.get("/api/profiles")
async def get_profiles(
    city: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = "active",
    featured: Optional[bool] = None,
    age_min: Optional[int] = None,
    age_max: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    sort: str = "order"
):
    query = {}
    if status and status != "all":
        query["status"] = status
    if city:
        query["city_slug"] = city
    if region:
        # Find cities in region
        reg = await db.regions.find_one({"slug": region})
        if reg and "cities" in reg:
            query["city_slug"] = {"$in": reg["cities"]}
    if category:
        query["categories"] = category
    if featured is not None:
        query["featured"] = featured
    if age_min is not None:
        query["age"] = {"$gte": age_min}
    if age_max is not None:
        if "age" in query:
            query["age"]["$lte"] = age_max
        else:
            query["age"] = {"$lte": age_max}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]

    sort_field = "order" if sort == "order" else "created_at"
    sort_dir = 1 if sort == "order" else -1

    total = await db.profiles.count_documents(query)
    skip = (page - 1) * limit
    
    # NEW SORTING: Use aggregation pipeline for better control
    # Priority: last_push_at DESC (nulls last) > featured DESC > premium DESC > sort_field
    pipeline = [
        {"$match": query},
        {
            "$addFields": {
                "sort_push": {"$ifNull": ["$last_push_at", datetime.min]}
            }
        },
        {"$sort": {
            "sort_push": -1,
            "featured": -1,
            "premium": -1,
            sort_field: sort_dir
        }},
        {"$skip": skip},
        {"$limit": limit}
    ]
    
    profiles_cursor = db.profiles.aggregate(pipeline)
    profiles = await profiles_cursor.to_list(limit)
    
    return {
        "profiles": [serialize_doc(p) for p in profiles],
        "total": total,
        "page": page,
        "pages": max(1, -(-total // limit))
    }

@app.get("/api/profiles/{slug}")
async def get_profile(slug: str):
    profile = await db.profiles.find_one({"slug": slug})
    if not profile:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")
    # Increment view count
    await db.profiles.update_one({"slug": slug}, {"$inc": {"view_count": 1}})
    # Get city info
    city = await db.cities.find_one({"slug": profile.get("city_slug", "")})
    result = serialize_doc(profile)
    result["city_name"] = city["name"] if city else profile.get("city_slug", "")
    return result

@app.post("/api/profiles")
async def create_profile(data: ProfileCreate, _: str = Depends(require_admin)):
    # Validation: active profiles must have phone
    if data.status == "active" and (not data.contact or not data.contact.phone):
        raise HTTPException(status_code=400, detail="Aktive Profile benötigen eine Telefonnummer")
    
    # Validation: addons require corresponding contact fields
    if data.addons:
        if data.addons.whatsapp_enabled and (not data.contact or not data.contact.whatsapp):
            raise HTTPException(status_code=400, detail="WhatsApp-Button erfordert WhatsApp-Kontakt")
        if data.addons.telegram_enabled and (not data.contact or not data.contact.telegram):
            raise HTTPException(status_code=400, detail="Telegram-Button erfordert Telegram-Kontakt")
        if data.addons.maps_enabled and (not data.contact or not data.contact.maps_url):
            raise HTTPException(status_code=400, detail="Maps-Button erfordert Maps-URL")
    
    base_slug = slugify(f"{data.name}-{data.city_slug}")
    slug = await generate_unique_slug(base_slug, "profiles")

    # Get region from city
    city = await db.cities.find_one({"slug": data.city_slug})
    region_slug = city["region_slug"] if city else ""

    doc = {
        **data.dict(),
        "slug": slug,
        "region_slug": region_slug,
        "photos": [],
        "view_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_push_at": None,  # Will be set on first push
        "push_package": {
            "active": False,
            "daily_time": None,
            "start_at": None,
            "end_at": None,
            "last_run_at": None,
            "timezone": "Europe/Berlin"
        }
    }
    
    # Ensure addons exist with defaults
    if "addons" not in doc or doc["addons"] is None:
        doc["addons"] = {
            "whatsapp_enabled": False,
            "telegram_enabled": False,
            "maps_enabled": False
        }
    if doc.get("contact") and hasattr(doc["contact"], "dict"):
        doc["contact"] = doc["contact"].dict()
    elif doc.get("contact") is None:
        doc["contact"] = {"whatsapp": None, "telegram": None, "phone": None, "show_whatsapp": True, "show_telegram": True, "show_phone": True}

    result = await db.profiles.insert_one(doc)
    profile = await db.profiles.find_one({"_id": result.inserted_id})
    return serialize_doc(profile)

@app.put("/api/profiles/{profile_id}")
async def update_profile(profile_id: str, data: ProfileUpdate, _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")

    # Regenerate slug if name/city changed
    if data.name != existing.get("name") or data.city_slug != existing.get("city_slug"):
        base_slug = slugify(f"{data.name}-{data.city_slug}")
        slug = await generate_unique_slug(base_slug, "profiles", profile_id)
    else:
        slug = existing["slug"]

    # Get region from city
    city = await db.cities.find_one({"slug": data.city_slug})
    region_slug = city["region_slug"] if city else existing.get("region_slug", "")

    update_data = data.dict()
    if update_data.get("contact") and hasattr(update_data["contact"], "dict"):
        update_data["contact"] = update_data["contact"].dict()
    elif update_data.get("contact") is None:
        update_data["contact"] = existing.get("contact", {})
    
    if update_data.get("addons") and hasattr(update_data["addons"], "dict"):
        update_data["addons"] = update_data["addons"].dict()
    elif update_data.get("addons") is None:
        update_data["addons"] = existing.get("addons", {
            "whatsapp_enabled": False,
            "telegram_enabled": False,
            "maps_enabled": False
        })

    update_data["slug"] = slug
    update_data["region_slug"] = region_slug
    update_data["updated_at"] = datetime.utcnow()

    await db.profiles.update_one({"_id": ObjectId(profile_id)}, {"$set": update_data})
    profile = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    return serialize_doc(profile)

@app.delete("/api/profiles/{profile_id}")
async def delete_profile(profile_id: str, _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")
    # Delete photos
    for photo in existing.get("photos", []):
        photo_path = UPLOAD_DIR / Path(photo["url"]).name
        if photo_path.exists():
            photo_path.unlink()
    await db.profiles.delete_one({"_id": ObjectId(profile_id)})
    return {"status": "deleted"}

# ─── Push Package Endpoints ───────────────────────────────────
@app.put("/api/profiles/{profile_id}/push-package")
async def update_push_package(profile_id: str, data: PushPackageUpdate, _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")
    
    berlin_tz = pytz.timezone('Europe/Berlin')
    now = datetime.now(berlin_tz)
    
    push_package = {
        "active": data.active,
        "daily_time": data.daily_time,
        "timezone": "Europe/Berlin"
    }
    
    if data.active:
        # Validate time format
        if not data.daily_time or len(data.daily_time) != 5:
            raise HTTPException(status_code=400, detail="daily_time muss Format HH:MM haben")
        try:
            hours, minutes = map(int, data.daily_time.split(':'))
            if hours < 0 or hours > 23 or minutes < 0 or minutes > 59:
                raise ValueError
        except:
            raise HTTPException(status_code=400, detail="Ungültige Uhrzeit")
        
        # Set start_at and end_at
        push_package["start_at"] = now
        push_package["end_at"] = now + timedelta(days=data.duration_days)
        push_package["last_run_at"] = None
    else:
        # Deactivate: keep existing dates for reference
        existing_pkg = existing.get("push_package", {})
        push_package["start_at"] = existing_pkg.get("start_at")
        push_package["end_at"] = existing_pkg.get("end_at")
        push_package["last_run_at"] = existing_pkg.get("last_run_at")
    
    await db.profiles.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": {"push_package": push_package}}
    )
    
    profile = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    return serialize_doc(profile)

@app.post("/api/profiles/{profile_id}/push/manual")
async def manual_push(profile_id: str, _: str = Depends(require_admin)):
    """Manually push a profile to the top"""
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")
    
    berlin_tz = pytz.timezone('Europe/Berlin')
    now = datetime.now(berlin_tz)
    
    await db.profiles.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": {"last_push_at": now}}
    )
    
    return {"status": "pushed", "last_push_at": now.isoformat()}

@app.get("/api/admin/push-due")
async def get_push_due(_: str = Depends(require_admin)):
    """Debug endpoint to see which profiles are due for push"""
    berlin_tz = pytz.timezone('Europe/Berlin')
    now = datetime.now(berlin_tz)
    current_time_str = now.strftime("%H:%M")
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    query = {
        "push_package.active": True,
        "push_package.end_at": {"$gt": now},
        "push_package.daily_time": current_time_str,
        "$or": [
            {"push_package.last_run_at": None},
            {"push_package.last_run_at": {"$lt": today_start}}
        ]
    }
    
    profiles = await db.profiles.find(query).to_list(100)
    return {
        "current_time": current_time_str,
        "due_count": len(profiles),
        "profiles": [{"id": str(p["_id"]), "name": p["name"], "daily_time": p["push_package"]["daily_time"]} for p in profiles]
    }

@app.post("/api/profiles/{profile_id}/photos")
async def upload_photos(profile_id: str, files: List[UploadFile] = File(...), _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")

    new_photos = []
    current_photos = existing.get("photos", [])
    next_order = len(current_photos)

    for file in files:
        try:
            content = await file.read()
            filename = await process_image(content)
            photo = {
                "id": uuid.uuid4().hex,
                "filename": filename,
                "url": f"/api/uploads/{filename}",
                "alt": f"Foto von {existing.get('name', 'Profil')}",
                "is_primary": len(current_photos) == 0 and next_order == 0,
                "order": next_order
            }
            current_photos.append(photo)
            new_photos.append(photo)
            next_order += 1
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Fehler beim Verarbeiten von {file.filename}: {str(e)}")

    await db.profiles.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": {"photos": current_photos, "updated_at": datetime.utcnow()}}
    )
    return {"photos": new_photos, "total": len(current_photos)}

@app.delete("/api/profiles/{profile_id}/photos/{photo_id}")
async def delete_photo(profile_id: str, photo_id: str, _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")

    photos = existing.get("photos", [])
    photo_to_delete = next((p for p in photos if p["id"] == photo_id), None)
    if not photo_to_delete:
        raise HTTPException(status_code=404, detail="Foto nicht gefunden")

    # Delete file
    filepath = UPLOAD_DIR / photo_to_delete["filename"]
    if filepath.exists():
        filepath.unlink()

    # Update photos list
    new_photos = [p for p in photos if p["id"] != photo_id]
    # Ensure at least one primary
    if new_photos and not any(p["is_primary"] for p in new_photos):
        new_photos[0]["is_primary"] = True
    # Re-order
    for i, p in enumerate(new_photos):
        p["order"] = i

    await db.profiles.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": {"photos": new_photos, "updated_at": datetime.utcnow()}}
    )
    return {"status": "deleted", "remaining": len(new_photos)}

@app.put("/api/profiles/{profile_id}/photos/{photo_id}/primary")
async def set_primary_photo(profile_id: str, photo_id: str, _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")
    photos = existing.get("photos", [])
    for p in photos:
        p["is_primary"] = p["id"] == photo_id
    await db.profiles.update_one({"_id": ObjectId(profile_id)}, {"$set": {"photos": photos}})
    return {"status": "ok"}

@app.put("/api/profiles/{profile_id}/photos/{photo_id}/alt")
async def update_photo_alt(profile_id: str, photo_id: str, data: PhotoAltUpdate, _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")
    photos = existing.get("photos", [])
    for p in photos:
        if p["id"] == photo_id:
            p["alt"] = data.alt
    await db.profiles.update_one({"_id": ObjectId(profile_id)}, {"$set": {"photos": photos}})
    return {"status": "ok"}

@app.put("/api/profiles/{profile_id}/photos/reorder")
async def reorder_photos(profile_id: str, data: PhotoReorderRequest, _: str = Depends(require_admin)):
    existing = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden")
    photos = existing.get("photos", [])
    photo_map = {p["id"]: p for p in photos}
    new_photos = []
    for i, pid in enumerate(data.photo_ids):
        if pid in photo_map:
            photo_map[pid]["order"] = i
            new_photos.append(photo_map[pid])
    await db.profiles.update_one({"_id": ObjectId(profile_id)}, {"$set": {"photos": new_photos}})
    return {"status": "ok", "photos": new_photos}

# ─── Applications Endpoints ───────────────────────────────────
@app.post("/api/applications")
async def create_application(
    name: str = Form(...),
    age: int = Form(...),
    city: str = Form(...),
    contact_info: str = Form(...),
    description: Optional[str] = Form(None),
    photos: List[UploadFile] = File(default=[])
):
    photo_filenames = []
    for file in photos:
        if file.filename:
            try:
                content = await file.read()
                filename = await process_image(content)
                photo_filenames.append(filename)
            except Exception:
                pass

    doc = {
        "name": name,
        "age": age,
        "city": city,
        "contact_info": contact_info,
        "description": description,
        "photos": [f"/api/uploads/{f}" for f in photo_filenames],
        "status": "new",
        "notes": "",
        "created_at": datetime.utcnow()
    }
    result = await db.applications.insert_one(doc)
    application = await db.applications.find_one({"_id": result.inserted_id})
    return serialize_doc(application)

@app.get("/api/applications")
async def get_applications(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    _: str = Depends(require_admin)
):
    query = {}
    if status and status != "all":
        query["status"] = status
    total = await db.applications.count_documents(query)
    skip = (page - 1) * limit
    apps = await db.applications.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return {
        "applications": [serialize_doc(a) for a in apps],
        "total": total,
        "page": page,
        "pages": max(1, -(-total // limit))
    }

@app.put("/api/applications/{app_id}")
async def update_application(app_id: str, data: ApplicationStatusUpdate, _: str = Depends(require_admin)):
    existing = await db.applications.find_one({"_id": ObjectId(app_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    update = {"status": data.status}
    if data.notes is not None:
        update["notes"] = data.notes
    await db.applications.update_one({"_id": ObjectId(app_id)}, {"$set": update})
    app = await db.applications.find_one({"_id": ObjectId(app_id)})
    return serialize_doc(app)

@app.delete("/api/applications/{app_id}")
async def delete_application(app_id: str, _: str = Depends(require_admin)):
    await db.applications.delete_one({"_id": ObjectId(app_id)})
    return {"status": "deleted"}

# ─── Admin Stats ──────────────────────────────────────────────
@app.get("/api/admin/stats")
async def get_admin_stats(_: str = Depends(require_admin)):
    total_profiles = await db.profiles.count_documents({})
    active_profiles = await db.profiles.count_documents({"status": "active"})
    pending_profiles = await db.profiles.count_documents({"status": "pending"})
    hidden_profiles = await db.profiles.count_documents({"status": "hidden"})
    total_cities = await db.cities.count_documents({})
    total_applications = await db.applications.count_documents({})
    new_applications = await db.applications.count_documents({"status": "new"})
    total_views = await db.profiles.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$view_count"}}}
    ]).to_list(1)
    views = total_views[0]["total"] if total_views else 0
    return {
        "total_profiles": total_profiles,
        "active_profiles": active_profiles,
        "pending_profiles": pending_profiles,
        "hidden_profiles": hidden_profiles,
        "total_cities": total_cities,
        "total_applications": total_applications,
        "new_applications": new_applications,
        "total_views": views
    }

# ─── Sitemap ──────────────────────────────────────────────────
@app.get("/api/sitemap.xml")
async def sitemap():
    base = SITE_URL
    urls = []

    def url_entry(loc, changefreq="weekly", priority="0.7", lastmod=None):
        mod = f"<lastmod>{lastmod}</lastmod>" if lastmod else ""
        return f"<url><loc>{loc}</loc>{mod}<changefreq>{changefreq}</changefreq><priority>{priority}</priority></url>"

    urls.append(url_entry(f"{base}/", "daily", "1.0"))
    urls.append(url_entry(f"{base}/bewerben", "monthly", "0.5"))
    urls.append(url_entry(f"{base}/impressum", "yearly", "0.3"))
    urls.append(url_entry(f"{base}/datenschutz", "yearly", "0.3"))
    urls.append(url_entry(f"{base}/agb", "yearly", "0.3"))

    cities = await db.cities.find().to_list(100)
    for city in cities:
        urls.append(url_entry(f"{base}/stadte/{city['slug']}", "daily", "0.8"))

    regions = await db.regions.find().to_list(20)
    for region in regions:
        urls.append(url_entry(f"{base}/regionen/{region['slug']}", "weekly", "0.7"))

    categories = await db.categories.find().to_list(50)
    for cat in categories:
        urls.append(url_entry(f"{base}/kategorien/{cat['slug']}", "weekly", "0.7"))

    profiles = await db.profiles.find({"status": "active"}).to_list(10000)
    for profile in profiles:
        lastmod = profile.get("updated_at", datetime.utcnow()).strftime("%Y-%m-%d") if isinstance(profile.get("updated_at"), datetime) else None
        urls.append(url_entry(f"{base}/profile/{profile['slug']}", "weekly", "0.9", lastmod))

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += "\n".join(urls)
    xml += "\n</urlset>"

    return Response(content=xml, media_type="application/xml")


# ─── Scheduler: Auto-Push Logic ──────────────────────────────
async def run_auto_push():
    """
    Check for profiles with active push packages that are due now.
    Update last_push_at for profiles that meet all criteria.
    """
    try:
        berlin_tz = pytz.timezone('Europe/Berlin')
        now = datetime.now(berlin_tz)
        current_time_str = now.strftime("%H:%M")
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Find profiles with active push packages due now
        query = {
            "push_package.active": True,
            "push_package.end_at": {"$gt": now},
            "push_package.daily_time": current_time_str,
            "$or": [
                {"push_package.last_run_at": None},
                {"push_package.last_run_at": {"$lt": today_start}}
            ]
        }
        
        profiles = await db.profiles.find(query).to_list(100)
        
        pushed_count = 0
        for profile in profiles:
            # Update last_push_at and last_run_at
            await db.profiles.update_one(
                {"_id": profile["_id"]},
                {
                    "$set": {
                        "last_push_at": now,
                        "push_package.last_run_at": now
                    }
                }
            )
            pushed_count += 1
            
        if pushed_count > 0:
            print(f"[AUTO-PUSH] Pushed {pushed_count} profile(s) at {current_time_str}")
            
    except Exception as e:
        print(f"[AUTO-PUSH ERROR] {str(e)}")

# Start scheduler on app startup
@app.on_event("startup")
async def start_scheduler():
    """Start the APScheduler for auto-push functionality"""
    scheduler.add_job(
        run_auto_push,
        trigger=CronTrigger(minute='*/1', timezone='Europe/Berlin'),  # Run every minute
        id='auto_push_job',
        name='Auto-push profiles',
        replace_existing=True
    )
    scheduler.start()
    print("✅ Scheduler started - Auto-push job active")

@app.on_event("shutdown")
async def shutdown_scheduler():
    """Shutdown scheduler gracefully"""
    scheduler.shutdown()
    print("🛑 Scheduler stopped")


# ─── Support & Inserieren Endpoints ─────────────────────────

class SupportRequest(BaseModel):
    email: str
    subject: str
    message: str

class InserierenRequest(BaseModel):
    arbeitsname: str
    nationalitaet: str
    alter: int
    sprachen: List[Dict[str, str]]  # [{sprache: "Deutsch", niveau: "Muttersprache"}]
    koerbchengroesse: str
    gewicht: str
    koerpergroesse: str
    intimrasur: str
    tattoos: str
    piercings: List[str]
    service_typen: List[str]  # Besuchbar, Haus- & Hotelbesuche, Online
    stadt: str
    handynummer: str
    zusatzoptionen: bool = False
    arbeitszeiten_247: bool = False
    arbeitszeiten: Optional[Dict[str, str]] = None
    inserat_text: Optional[str] = None
    email: str

@app.post("/api/support")
async def submit_support(req: SupportRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "email": req.email,
        "subject": req.subject,
        "message": req.message,
        "status": "open",
        "created_at": datetime.now(pytz.UTC).isoformat()
    }
    await db.support_requests.insert_one(doc)
    return {"success": True, "message": "Support-Anfrage eingegangen"}

@app.post("/api/inserieren")
async def submit_inserieren(req: InserierenRequest):
    doc = {
        "id": str(uuid.uuid4()),
        **req.model_dump(),
        "status": "pending",
        "created_at": datetime.now(pytz.UTC).isoformat()
    }
    await db.inserieren_requests.insert_one(doc)
    return {"success": True, "message": "Inserat eingegangen"}
