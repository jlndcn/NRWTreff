# plan.md

## 1) Objectives
- Deliver a **production-ready, mobile-first adult advertising platform for NRW (DE)** using **FastAPI + React + MongoDB**.
- Enforce a **curated model onboarding** workflow:
  - Profiles are **admin-only** (no self-service profile creation).
  - Public applicants use `/bewerben` and are reviewed/added by admin.
- Provide **true SEO-capable rendering (NOT pure SPA)** for all indexable pages:
  - **SSR / server-generated HTML** for: `/` (Startseite), `/stadte/:slug`, `/regionen/:slug`, `/kategorien/:slug`, `/profile/:slug`.
  - HTML must include **meaningful content + meta tags** without requiring client-side JS execution.
- Provide full technical SEO:
  - Root `GET /sitemap.xml`
  - Root `GET /robots.txt`
  - **Canonicals**, **Open Graph**, **Twitter cards**, and **JSON-LD** emitted server-side.
- Provide an **admin area** (JWT) with credentials **Test123/Test123** for managing profiles, photos, SEO fields, cities/regions/categories, and applications.
- Ensure legal/compliance basics: **18+ modal**, disclaimers, and legal pages.
- **Image handling**:
  - Store images as optimized **WebP files on disk**.
  - Store only **path + metadata** in MongoDB (no base64) ✅.
- **Simple monetization + profile system (no VIP/gold/rotation complexity)**:
  - All listings treated equally.
  - Sort order is purely by **last push timestamp** (descending), with fallback to **created_at**.
  - Add **paid push packages** administered by admin:
    - Auto-push a profile **daily at a configured time**.
    - Packages have limited duration (default **30 days**).
  - **Contact buttons**:
    - Every profile has **Call** button (minimum requirement).
    - Optional paid add-ons: **WhatsApp**, **Telegram**, **Google Maps**.
    - Admin can enable/disable these per profile.
  - **Profile page as individualized landingpage** (for all profiles): high-quality mini-website layout with controlled per-profile styling.
- Current deployment target (preview): **https://direct-connect-32.preview.emergentagent.com**.

> **User constraints (confirmed):**
> - No Puppeteer-based prerendering as the main approach.
> - Use an **Express SSR** approach in the existing stack.
> - Monetization features implemented **sequentially**:
>   1) Push system + sorting ✅, 2) Button system ⏳, 3) Individualized profile landingpages ⏳.

---

## 2) Implementation Steps (Phased)

### Phase 1 — Core Flow POC (Isolation) (SEO + Upload + Rendering proof) ✅ COMPLETED
Goal: Prove the hardest parts work end-to-end: **image upload/serve**, **filterable profile listing**, **SEO approach**, **sitemap generation**.

User stories (validated):
1. As a visitor, I can open a profile page and see correct title/description/canonical + OG tags.
2. As Google, I can discover profile/city/category pages via sitemap.
3. As an admin, I can upload images and see them served fast on the profile page.
4. As a visitor, I can filter by city/region/category and get stable URLs.
5. As a mobile user, I can tap contact buttons and it opens the correct app/action.

Artifacts:
- POC test script created and executed successfully (`/app/tests/test_core_poc.py`).

---

### Phase 2 — V1 App Development (MVP end-to-end) ✅ COMPLETED
Delivered:
- Seed data (admin user, NRW cities/regions/categories)
- Backend CRUD for profiles + applications, image upload pipeline
- Frontend public pages + admin dashboard

---

### Phase 2.5 — Image Handling Verification & Hardening (No Base64) ✅ COMPLETED
Status:
- Backend uses `multipart/form-data`, Pillow pipeline, WebP on disk under `/app/backend/uploads`.
- MongoDB stores only file references and metadata (no Base64).

---

### Phase 3 — True SSR / Pre-rendering for Indexable Pages (Node Express SSR Gateway) ✅ COMPLETED
Status:
- Implemented Express SSR server (`/app/frontend/server.js`).
- SSR injects meta tags + meaningful initial content into CRA build template.
- Root SEO endpoints:
  - `/sitemap.xml` proxied from backend `/api/sitemap.xml`
  - `/robots.txt` served at root (Cloudflare-managed header content may appear; custom directives appended).
- Legal pages SSR meta tags added.

Deliverables:
- `frontend/server.js`
- `frontend/start-ssr.sh`
- `frontend/package.json` updated scripts (`start` runs SSR)

---

### Phase 3.1 — Comprehensive Test Run (Testing Agent) ✅ COMPLETED
Status:
- Test report created: `/app/test_reports/iteration_2.json`
- Result highlights:
  - Backend 100% passing
  - SSR verified for indexable routes
  - Legal pages SSR meta tags fixed
  - Minor mobile UI issues noted (non-blocking for next backend-first phases)

---

## 3) Monetization + Profile System (Sequential)

### Phase 6 — Push System + Sorting (APScheduler) ✅ COMPLETED
**Goal:** Implement a simple paid visibility model with deterministic ordering:
- Sort **all active profiles** by:
  1) `last_push_at` (desc), else
  2) `created_at` (desc)

#### 6.1 Data Model Changes (MongoDB) ✅
Added/ensured fields in `profiles`:
- `created_at` (always set)
- `last_push_at: datetime | null`
- `push_package` object:
  - `active: bool`
  - `start_at: datetime`
  - `end_at: datetime` (default start + **30 days**)
  - `daily_time: "HH:MM"`
  - `timezone: "Europe/Berlin"`
  - `last_run_at: datetime | null` (guard against multiple pushes per day)

#### 6.2 Backend API Changes (FastAPI) ✅
Admin endpoints implemented:
1) `POST /api/profiles/{id}/push/manual` → sets `last_push_at = now`
2) `PUT /api/profiles/{id}/push-package` → activates/deactivates package, validates `daily_time`, sets `end_at`
3) `GET /api/admin/push-due` → debug endpoint

#### 6.3 Scheduler: APScheduler inside FastAPI process ✅
- APScheduler (AsyncIOScheduler) running in timezone `Europe/Berlin`
- Job runs every minute:
  - checks active + not expired + due time + not already pushed today
  - updates `last_push_at` and `push_package.last_run_at`

#### 6.4 Listing sorting ✅
- `/api/profiles` now uses aggregation sorting with:
  - `last_push_at` DESC (nulls last)
  - fallback on `created_at` DESC

#### 6.5 Admin UI ✅
- `AdminProfileEdit` has a new **Push-Paket** tab:
  - activate/deactivate
  - daily time picker
  - start/end dates display
  - manual push button

Testing:
- API endpoints verified via curl.
- Scheduler startup confirmed in backend logs.

---

### Phase 7 — Button System (Call default, Paid add-ons) ⏳ IN PROGRESS (START HERE)
**Goal:** Simple, understandable monetization via optional buttons displayed on **profile cards** and **profile pages**.

#### 7.1 Data model (MongoDB)
Update profile contact + add-ons in a backwards-compatible way.

**Contact fields** (stored under `contact`):
- `phone` (string; required for active profiles to satisfy “Call button minimum requirement”)
- optional:
  - `whatsapp` (string; recommended E.164 like `+491...` OR full wa.me link)
  - `telegram` (string; full link `https://t.me/...`)
  - `maps_url` (string; Google Maps link)

**Add-on toggles** (new object, e.g. `addons`):
- `addons.whatsapp_enabled: bool` (paid)
- `addons.telegram_enabled: bool` (paid)
- `addons.maps_enabled: bool` (paid)

Display rules:
- **Call** button: show if `contact.phone` is set (enforce for `status=active`).
- **WhatsApp**: show if `contact.whatsapp` AND `addons.whatsapp_enabled`.
- **Telegram**: show if `contact.telegram` AND `addons.telegram_enabled`.
- **Google Maps**: show if `contact.maps_url` AND `addons.maps_enabled`.

#### 7.2 Backend changes (FastAPI)
1) Schema updates:
   - extend `ContactInfo` model to include `maps_url` (and ensure `phone` field exists)
   - introduce `addons` model (or plain dict) on Profile
2) Validation rules:
   - when profile is set to `status=active`, ensure `contact.phone` exists.
   - prevent enabling an add-on without its underlying data:
     - if `addons.whatsapp_enabled == true` require `contact.whatsapp`
     - if `addons.telegram_enabled == true` require `contact.telegram`
     - if `addons.maps_enabled == true` require `contact.maps_url`
3) Ensure API serialization returns `addons` fields.
4) Migration behavior:
   - existing profiles without `addons` should default to all `false`.

#### 7.3 Admin UI changes (AdminProfileEdit → Kontakt Tab)
- Add inputs:
  - phone
  - whatsapp
  - telegram
  - maps_url
- Add paid add-on toggles:
  - WhatsApp aktiv
  - Telegram aktiv
  - Maps aktiv
- UX rules:
  - disable toggle if field empty, or show inline error on save.
  - provide helper text (e.g., WhatsApp expects E.164 or link).

#### 7.4 Frontend changes (Public)
**Profile cards**:
- render active buttons with clear icons:
  - Phone icon (Call)
  - WhatsApp icon
  - Telegram icon
  - MapPin/Map icon
- click behaviors:
  - Call: `tel:${phone}`
  - WhatsApp: normalize to `https://wa.me/<E164>` if input is E.164/phone; if already a URL, use it.
  - Telegram: open stored URL
  - Maps: open stored `maps_url`
- ensure buttons are accessible on mobile (large tap targets).

**Profile page**:
- same button set, but larger CTA section.

#### 7.5 SEO/SSR considerations (Phase 7)
- Buttons do not change SSR fundamentals.
- Ensure SSR placeholder content for profile pages still includes key text and does not break if add-ons are present.

#### 7.6 Testing (Phase 7)
Backend:
- unit/integration tests for validation rules:
  - active profile without phone must fail
  - enabling add-on without underlying field must fail
- verify API returns correct `addons` flags

Frontend:
- verify card shows correct buttons based on toggles
- verify links open correctly (`tel:`, `wa.me`, `t.me`, maps url)
- mobile viewport manual/screenshot checks

Deliverables:
- Backend schema + validation + endpoints updated
- Admin UI extended
- Public UI buttons on cards + profile page
- Test report (manual + automated where possible)

---

### Phase 8 — Individualized Profile Landingpages (All profiles) ⏳ AFTER PHASE 7
**Goal:** Every profile page feels like a strong, individualized mini-website (not a generic detail view), within a controlled design system.

#### 8.1 Data model additions
- `theme`:
  - `accent_color` (hex)
- `hero`:
  - `tagline` (string)
- `content_blocks` (simple version, multiple text areas):
  - `intro`
  - `about`
  - `services`
  - `faq`
  - `cta_text`

#### 8.2 Admin UI
- Inputs for accent color, hero tagline, and multiple text areas.

#### 8.3 Frontend profile page redesign
Landingpage sections:
- Hero with accent styling + tagline
- Large gallery
- Intro + multiple text sections
- Prominent CTA/contact area (buttons from Phase 7)
- Optional location section if maps add-on is active

SSR considerations:
- SSR meta tags use profile SEO fields and OG image.
- SSR body includes at least hero text + intro snippet for crawlability.

Testing:
- Visual regression (screenshots)
- SSR HTML contains key hero/intro text

---

## 4) Next Actions
1. **Start Phase 7**:
   - extend backend schema (`contact.maps_url`, `addons.*_enabled`)
   - implement validation rules and defaults
2. Update **AdminProfileEdit → Kontakt** tab for fields + toggles.
3. Implement **profile card** buttons and **profile page** CTA buttons.
4. Run dedicated tests for Phase 7.
5. After Phase 7 passes: implement Phase 8 landingpage redesign.

---

## 5) Success Criteria
### SEO/SSR (already achieved)
- Indexable pages return HTML with content + SEO tags without JS execution ✅
- `/sitemap.xml` and `/robots.txt` reachable at root ✅

### Push & Sorting (Phase 6) ✅
- Public listings sort by `last_push_at` desc, fallback `created_at` desc.
- Push package:
  - Admin can activate a 30-day package
  - Profile auto-pushes daily at configured time (Europe/Berlin)
  - No duplicate pushes per day
  - Expired packages stop pushing

### Buttons (Phase 7)
- Call button exists for all active profiles and works via click-to-call.
- Optional WhatsApp/Telegram/Maps buttons are admin-controlled and display only when enabled + configured.
- Profile cards show icons clearly and are mobile-friendly.

### Profile landingpages (Phase 8)
- Every profile page is a high-quality mini-website.
- Accent color + hero tagline + multiple text areas are configurable.
- SSR includes crawlable hero/intro content.
