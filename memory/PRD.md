# NRWTreff - PRD

## Architecture
- Frontend: React (CRA+Craco) + Tailwind + Radix UI
- Backend: FastAPI + MongoDB
- Auth: JWT admin auth + bcrypt

## v7 (Current - April 15, 2026)
- **Header**: Transparent (0.45), Städte dropdown (10 NRW cities + "Mehr"), Kontakt dropdown (Support/Inserieren), nav items turn red on hover
- **Sub-nav**: GIRLS, FKK CLUBS, BORDELLE, ROTZLICHT-CAM (slightly smaller text)
- **Hero**: New nightlife photo, higher opacity (0.45), Rajdhani font headline
- **Feature Cards**: 30% bigger, Performance card has 4 interlocking gears always visible at 100% opacity (rotate on hover), Verifiziert card turns fully green on hover, Diskret card blurred until hover
- **Footer**: Marquee text 100% opacity, full height, 80s speed (slower), bigger text
- **Support Page**: Form with email, subject, message + disclaimer about false claims
- **Inserieren Page**: Full form with Arbeitsname, Nationalität, Alter, Sprachen (12 languages with proficiency levels), Körbchengröße, Gewicht, Größe, Intimrasur, Tattoos, Piercings, Service types, Stadt, Handynummer, Zusatzoptionen, Arbeitszeiten (Mon-Sun), individueller Inseratstext
- **Backend**: /api/support and /api/inserieren endpoints saving to MongoDB

## Backlog
### P1: Category pages, City pages, Profile detail pages
### P2: Email notifications for support/inserieren, Legal pages content
