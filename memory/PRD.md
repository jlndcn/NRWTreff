# NRWTreff - PRD

## v16 (Current - April 15, 2026)
### Mobile Optimization
- Header: Sub-nav hidden on mobile, fullscreen slide-in menu with logical sections (Kategorien > Städte > Kontakt)
- Body scroll lock when mobile menu is open
- Hero: responsive font scaling (clamp), compact padding (10rem mobile vs 18rem desktop)
- Search bar: smaller padding/font on mobile, button text fits
- Feature cards: IntersectionObserver auto-triggers animations when scrolled into view (threshold 0.4)
  - Diskret: blur clears on in-view
  - Performance: gears + speed lines start on in-view
  - Verifiziert: turns green on in-view
- Cards: compact padding (2rem mobile vs 2.5rem desktop), 1rem gap mobile vs 1.5rem desktop
- Manifest: tighter padding, smaller fonts on mobile
- min-height: 100svh for hero (mobile viewport fix)
- background-attachment: scroll on mobile (fixes iOS)

## Backlog
- P1: File upload backend, Email notifications, Profile/Category/City pages
- P2: Admin dashboard, Legal pages
