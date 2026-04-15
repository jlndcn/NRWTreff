# NRWTreff - PRD (Product Requirements Document)

## Original Problem Statement
User wants to build NRWTreff - a German adult directory/escort platform for Nordrhein-Westfalen (NRW). The site was loaded from GitHub repo `jlndcn/NRWTreff`.

## Architecture
- **Frontend**: React (CRA with Craco) + Tailwind CSS + Radix UI components
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Auth**: JWT-based admin authentication with bcrypt
- **Images**: Static file serving via FastAPI uploads directory

## User Personas
- **Visitor**: Searches for profiles by city/category, browses listings
- **Admin**: Manages profiles, cities, categories, applications via admin dashboard

## Core Requirements
- Age verification modal (18+)
- City-based profile search
- Profile cards with contact info
- Admin dashboard for content management
- SEO-optimized pages (react-helmet-async)

## What's Been Implemented (April 15, 2026)

### Session 1 - Repository Setup
- Loaded codebase from GitHub (jlndcn/NRWTreff)
- Fixed missing dependencies (react-helmet-async, python-slugify)
- Fixed frontend start script (start-ssr.sh → craco start)

### Session 2 - First Design Update (Wireframe 1)
- Updated Header: Städte/Bordell buttons + sub-nav categories
- Updated "NRWTreff weil..." section: 3 cards (Verifiziert, Anonym, Einfach)
- Updated Footer: Social media, Boy Clubs, Poppen.de links, legal links

### Session 3 - Complete Landing Page Redesign (Wireframe 2)
- **Header**: NRWTreff Rotzlicht + Städte/Kontakt/18+ buttons + sub-nav (Girls, FKK Clubs, Rotzlicht.com)
- **Hero**: "Wo bist du, Süßer?" + pill-shaped search bar (Stadt eingeben/Suche) + 3 feature tags (Diskret, Performance, Verifiziert)
- **Footer**: Large NRWTreff branding, Girls/FKK Clubs links, Newsletter email form, Instagram, AGB+Datenschutz+Impressum, "Keine Gewährleistung für Fakes" disclaimer
- All tests passed (100%)

## Prioritized Backlog
### P0 (Critical)
- None currently

### P1 (Important)
- Profile detail pages refinement
- City pages content
- Category filtering (Girls, FKK Clubs etc.)

### P2 (Nice to have)
- Newsletter backend integration (currently frontend-only)
- Real Instagram link
- SEO schema markup refinement
- Mobile UX polish

## Next Tasks
- User to review landing page and provide feedback
- Implement actual Newsletter API endpoint
- Category pages for Girls, FKK Clubs
- Content pages for AGB, Datenschutz, Impressum
