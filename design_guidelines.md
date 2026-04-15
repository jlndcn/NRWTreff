{
  "brand": {
    "name": "NRW Rotlicht Directory",
    "attributes": [
      "roh",
      "direkt",
      "underground",
      "diskret",
      "conversion-fokussiert",
      "SEO-stark",
      "mobile-first",
      "dark-only"
    ],
    "anti_attributes": [
      "luxuriös",
      "steril",
      "weiß/hell",
      "pastell",
      "glossy gradients",
      "über-animiert"
    ],
    "language": "de-DE"
  },

  "design_personality": {
    "style_fusion": [
      "Neo-Brutalism (harte Kanten, klare Grenzen, plakative Typo)",
      "Underground Nightclub Poster Aesthetic (Neon-Rot Glow, Körnung)",
      "Editorial Directory Layout (Filter + Grid, schnelle Scanbarkeit)"
    ],
    "visual_rules": [
      "Kein heller/weißer Hintergrund – alle Flächen bleiben in Schwarz/Anthrazit.",
      "Rot ist Akzent + Signal (CTA, Badges, aktive Filter), nicht Flächenfarbe.",
      "Körnung/Noise als subtiler Overlay über ALLEM (CSS-only, performant).",
      "Typo: Oswald/Impact-Feeling für Headlines, Inter für Lesetext.",
      "Rau: 1px/2px harte Borders, leichte ""abgenutzte"" Highlights (nicht unscharf).",
      "Sexy/markant über Bilddominanz + klare Kontakt-CTAs, nicht über überladene Deko."
    ]
  },

  "typography": {
    "fonts": {
      "headings": {
        "family": "Oswald",
        "fallback": "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        "weights": ["500", "600", "700"],
        "usage": "H1/H2/Hero-Statements, Card-Titles, City/Category Headlines"
      },
      "body": {
        "family": "Inter",
        "fallback": "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        "weights": ["400", "500", "600"],
        "usage": "Body, Labels, Filtertexte, Meta-Infos"
      }
    },
    "scale_tailwind": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-[700] tracking-tight",
      "h2": "text-base md:text-lg font-[500] text-muted-foreground",
      "section_title": "text-2xl sm:text-3xl font-[700] tracking-tight",
      "card_title": "text-lg font-[600] leading-tight",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs text-muted-foreground"
    },
    "micro_typography": {
      "uppercase_usage": "Nur für Badges/Filter-Chips/Meta (nicht für lange Texte)",
      "letter_spacing": {
        "headings": "tracking-[0.02em]",
        "badges": "tracking-[0.08em]"
      }
    }
  },

  "color_system": {
    "notes": [
      "Dark-only. Keine Light-Mode Tokens nötig.",
      "Rot nur als Akzent (CTA/Active/Badge).",
      "Off-White für Text, aber nicht reinweiß (#fff) – wirkt zu clean."
    ],
    "palette_hex": {
      "bg_0": "#0a0a0a",
      "bg_1": "#111111",
      "bg_2": "#1a1a1a",
      "bg_3": "#222222",
      "text_0": "#f0f0f0",
      "text_1": "#e8e8e8",
      "muted": "#b7b7b7",
      "muted_2": "#8b8b8b",
      "border": "#2a2a2a",
      "border_strong": "#3a3a3a",
      "accent_red_0": "#cc0000",
      "accent_red_1": "#d4000f",
      "accent_red_2": "#ff2244",
      "success": "#2bd576",
      "warning": "#ffb020",
      "focus_ring": "#ff2244"
    },
    "semantic_tokens_hsl_for_shadcn": {
      "implementation": "Setze diese Werte in /frontend/src/index.css unter .dark (und optional :root, falls App ohne .dark startet).",
      "dark": {
        "--background": "0 0% 4%",
        "--foreground": "0 0% 94%",
        "--card": "0 0% 7%",
        "--card-foreground": "0 0% 94%",
        "--popover": "0 0% 7%",
        "--popover-foreground": "0 0% 94%",
        "--primary": "354 100% 57%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "0 0% 13%",
        "--secondary-foreground": "0 0% 94%",
        "--muted": "0 0% 12%",
        "--muted-foreground": "0 0% 72%",
        "--accent": "0 0% 14%",
        "--accent-foreground": "0 0% 94%",
        "--destructive": "354 100% 45%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "0 0% 16%",
        "--input": "0 0% 16%",
        "--ring": "354 100% 57%",
        "--radius": "0.75rem"
      }
    },
    "allowed_gradients": {
      "rule": "Auf dieser Plattform: möglichst KEINE großen Gradients. Wenn überhaupt, nur als sehr subtile Section-Overlay (<=20% viewport) und nur dunkel->dunkel.",
      "examples": [
        "bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,34,68,0.10)_0%,rgba(10,10,10,0)_60%)] (nur Hero, sehr subtil)",
        "bg-[linear-gradient(180deg,rgba(255,34,68,0.08)_0%,rgba(10,10,10,0)_55%)] (nur als Top-Glow)"
      ]
    },
    "neon_glow": {
      "usage": "Nur für Primary CTA, aktive Badges, wichtige Statuspunkte.",
      "tailwind_examples": [
        "shadow-[0_0_0_1px_rgba(255,34,68,0.35),0_0_24px_rgba(255,34,68,0.18)]",
        "ring-1 ring-[#ff2244]/40"
      ]
    }
  },

  "design_tokens_css": {
    "add_to_index_css": {
      "notes": "Diese Custom Properties ergänzen shadcn Tokens. In @layer base unter .dark oder :root definieren.",
      "tokens": {
        "--font-heading": "'Oswald', system-ui, -apple-system, Segoe UI, Roboto, Arial",
        "--font-body": "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial",
        "--shadow-neon": "0 0 0 1px rgba(255,34,68,0.35), 0 0 24px rgba(255,34,68,0.18)",
        "--shadow-card": "0 10px 30px rgba(0,0,0,0.45)",
        "--radius-card": "14px",
        "--radius-control": "12px",
        "--border-hard": "1px solid rgba(255,255,255,0.08)",
        "--border-hard-strong": "1px solid rgba(255,255,255,0.14)",
        "--noise-opacity": "0.08",
        "--tap": "44px"
      }
    }
  },

  "layout_grid": {
    "container": {
      "max_width": "max-w-6xl",
      "padding": "px-4 sm:px-6",
      "notes": "Mobile-first: Content nicht zentrieren wie Landingpage; eher editorial: linksbündige Typo, Grid darunter."
    },
    "listing_grid": {
      "grid": "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
      "card_aspect": "Portrait-lastig: aspect-[3/4] oder aspect-[4/5]",
      "infinite_or_pagination": "SEO + Performance: Pagination (shadcn Pagination) bevorzugen; Infinite nur optional."
    },
    "profile_page": {
      "desktop_split": "lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-8",
      "sticky_contact": "Mobile: sticky bottom bar; Desktop: sticky sidebar card"
    }
  },

  "texture_and_background": {
    "grain_css_only": {
      "implementation": "Nutze ein fixed pseudo-element Overlay auf body oder #root. Keine Bilddatei.",
      "css_snippet": "body::before {\n  content: '';\n  position: fixed;\n  inset: 0;\n  pointer-events: none;\n  z-index: 0;\n  opacity: var(--noise-opacity);\n  background-image:\n    repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px),\n    repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px);\n  mix-blend-mode: overlay;\n}\n#root { position: relative; z-index: 1; }"
    },
    "rough_edges": {
      "notes": "Rauheit über harte Borders + leichte ""stencil"" Divider + minimaler Glow. Keine SVG-Noise nötig.",
      "divider": "<Separator className=\"bg-white/10\" />",
      "card_border": "border border-white/10 hover:border-white/16"
    }
  },

  "components": {
    "component_path": {
      "shadcn_primary": "/app/frontend/src/components/ui/",
      "use_components": [
        "button.jsx",
        "badge.jsx",
        "card.jsx",
        "input.jsx",
        "select.jsx",
        "sheet.jsx",
        "drawer.jsx",
        "dialog.jsx",
        "breadcrumb.jsx",
        "carousel.jsx",
        "aspect-ratio.jsx",
        "pagination.jsx",
        "separator.jsx",
        "tabs.jsx",
        "table.jsx",
        "form.jsx",
        "textarea.jsx",
        "sonner.jsx"
      ]
    },
    "global_header": {
      "pattern": "Minimal top bar: Logo links, Diskret-Hinweis + 18+ Link rechts, Burger für Städte/Kategorien.",
      "shadcn": ["navigation-menu.jsx", "sheet.jsx", "breadcrumb.jsx"],
      "tailwind": "sticky top-0 z-40 bg-[#0a0a0a]/85 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/70 border-b border-white/10",
      "data_testid": {
        "logo": "site-header-logo-link",
        "menu_button": "site-header-menu-button"
      }
    },
    "sticky_filter_bar": {
      "where": ["/", "/stadte/[slug]", "/regionen/[slug]", "/kategorien/[slug]"],
      "behavior": [
        "Immer sichtbar (sticky).",
        "Mobile: horizontal scroll für Filter-Chips + Sheet für erweiterte Filter.",
        "Desktop: inline Selects + Search Input."
      ],
      "shadcn": ["input.jsx", "select.jsx", "sheet.jsx", "button.jsx", "separator.jsx"],
      "layout": {
        "wrapper": "sticky top-[56px] z-30 bg-[#111]/90 backdrop-blur border-b border-white/10",
        "inner": "max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2",
        "mobile_scroll": "overflow-x-auto [-webkit-overflow-scrolling:touch]"
      },
      "controls": {
        "search": "Input left icon (Lucide Search), placeholder: 'Stadt, Name, Kategorie…'",
        "selects": ["Stadt/Region", "Kategorie", "Alter"],
        "primary_action": "Button: 'Anwenden' (nur wenn nötig), sonst live-filter",
        "reset": "Ghost Button: 'Reset'"
      },
      "data_testid": {
        "search_input": "filter-bar-search-input",
        "city_select": "filter-bar-city-select",
        "category_select": "filter-bar-category-select",
        "age_select": "filter-bar-age-select",
        "apply_button": "filter-bar-apply-button",
        "reset_button": "filter-bar-reset-button",
        "open_more_filters": "filter-bar-more-filters-button"
      }
    },
    "profile_card": {
      "goal": "Sexy/markant: Foto dominiert, Infos minimal, CTA sofort sichtbar.",
      "shadcn": ["card.jsx", "badge.jsx", "button.jsx", "aspect-ratio.jsx"],
      "structure": [
        "Card (relative)",
        "Image area (AspectRatio) mit dunklem Verlauf nur am unteren Rand für Lesbarkeit",
        "Overlay: Name + Stadt + 1-2 Badges",
        "CTA row: WhatsApp / Telegram / Anrufen (Icons + Text)"
      ],
      "tailwind": {
        "card": "group relative overflow-hidden rounded-[var(--radius-card)] bg-[#111] border border-white/10 hover:border-white/16",
        "image": "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]",
        "bottom_overlay": "absolute inset-x-0 bottom-0 p-3 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.92)_100%)]",
        "badge": "bg-[#d4000f]/15 text-[#ff2244] border border-[#ff2244]/30",
        "cta_wrap": "mt-2 grid grid-cols-3 gap-2",
        "cta_primary": "bg-[#d4000f] text-[#f0f0f0] hover:bg-[#ff2244] shadow-[var(--shadow-neon)]",
        "cta_secondary": "bg-white/6 text-[#f0f0f0] hover:bg-white/10 border border-white/10"
      },
      "data_testid": {
        "card": "profile-card",
        "open_profile": "profile-card-open-link",
        "cta_whatsapp": "profile-card-whatsapp-button",
        "cta_telegram": "profile-card-telegram-button",
        "cta_call": "profile-card-call-button"
      }
    },
    "profile_gallery": {
      "where": "/profile/[slug]",
      "shadcn": ["carousel.jsx", "dialog.jsx", "aspect-ratio.jsx"],
      "behavior": [
        "Tap auf Bild öffnet Fullscreen Dialog mit Carousel.",
        "Preload nur 1-2 Bilder, rest lazy (Performance)."
      ],
      "data_testid": {
        "open_fullscreen": "profile-gallery-open-fullscreen",
        "carousel": "profile-gallery-carousel"
      }
    },
    "sticky_contact_bar_mobile": {
      "where": "/profile/[slug] (mobile)",
      "behavior": [
        "Sticky bottom, immer sichtbar.",
        "3 Buttons: WhatsApp, Telegram, Anrufen.",
        "Neon Glow nur auf WhatsApp (Primary)."
      ],
      "shadcn": ["button.jsx"],
      "tailwind": "fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0a]/92 backdrop-blur border-t border-white/10 p-3",
      "data_testid": {
        "bar": "profile-sticky-contact-bar",
        "whatsapp": "profile-sticky-whatsapp-button",
        "telegram": "profile-sticky-telegram-button",
        "call": "profile-sticky-call-button"
      }
    },
    "age_verification_modal": {
      "where": "first visit",
      "shadcn": ["alert-dialog.jsx", "button.jsx"],
      "copy": {
        "title": "18+ Hinweis",
        "body": "Diese Seite ist nur für Personen ab 18 Jahren. Mit dem Fortfahren bestätigst du, dass du volljährig bist.",
        "primary": "Ich bin 18+",
        "secondary": "Verlassen"
      },
      "visual": "Rauer Dialog: border-white/12, roter Fokus-Ring, keine großen Illustrationen.",
      "data_testid": {
        "modal": "age-verification-modal",
        "confirm": "age-verification-confirm-button",
        "leave": "age-verification-leave-button"
      }
    },
    "breadcrumbs": {
      "where": "alle Unterseiten",
      "shadcn": ["breadcrumb.jsx"],
      "tailwind": "text-xs text-white/70",
      "data_testid": {
        "nav": "breadcrumbs-nav"
      }
    },
    "seo_city_region_nav": {
      "where": ["/", "/stadte/[slug]", "/regionen/[slug]"],
      "pattern": "Textlinks in 2-3 Spalten (kein Tag-Cloud Chaos).",
      "tailwind": "grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm",
      "link": "text-white/80 hover:text-[#ff2244] underline-offset-4 hover:underline",
      "data_testid": {
        "city_nav": "city-navigation",
        "region_nav": "region-navigation"
      }
    },
    "application_form": {
      "where": "/bewerben",
      "shadcn": ["form.jsx", "input.jsx", "textarea.jsx", "checkbox.jsx", "button.jsx", "card.jsx"],
      "notes": [
        "Multi-Photo Upload: Dropzone-Style (custom) + Preview Grid.",
        "Klare Hinweise zu Diskretion/Prüfung.",
        "Primary CTA: 'Bewerbung senden' mit Neon Glow."
      ],
      "data_testid": {
        "form": "application-form",
        "submit": "application-form-submit-button",
        "photo_upload": "application-form-photo-upload"
      }
    },
    "admin_area": {
      "tone": "Cleaner, aber dark. Weniger Neon, mehr Struktur.",
      "shadcn": ["tabs.jsx", "table.jsx", "dialog.jsx", "form.jsx", "pagination.jsx", "badge.jsx", "button.jsx"],
      "layout": "Sidebar (desktop) + topbar (mobile).",
      "data_testid": {
        "admin_login_form": "admin-login-form",
        "admin_nav": "admin-navigation",
        "profiles_table": "admin-profiles-table",
        "applications_table": "admin-applications-table"
      }
    },
    "toasts": {
      "library": "sonner",
      "component": "/app/frontend/src/components/ui/sonner.jsx",
      "usage": "Erfolg/Fehler bei Kontakt-Link kopieren, Bewerbung gesendet, Admin CRUD.",
      "data_testid": {
        "toast_region": "toast-region"
      }
    }
  },

  "motion_and_microinteractions": {
    "principles": [
      "Keine schweren Scroll-Animationen. Nur kleine Hover/Press States.",
      "Prefer CSS transitions auf opacity/background-color/box-shadow/transform (gezielt).",
      "Respect prefers-reduced-motion."
    ],
    "allowed": {
      "card_hover": "scale(1.03) nur auf Bild, nicht auf ganze Card (verhindert Layout shift)",
      "button_press": "active:scale-[0.98]",
      "neon_pulse": "Optional: sehr subtiler keyframes glow für Primary CTA (nur 1-2 Elemente pro View)"
    },
    "tailwind_snippets": {
      "button": "transition-[background-color,box-shadow,opacity] duration-200",
      "image": "transition-transform duration-300",
      "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2244]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
    }
  },

  "accessibility": {
    "contrast": [
      "Off-White Text (#e8e8e8) auf #0a0a0a/#111 ist AA-safe.",
      "Rot (#ff2244) nur für Akzente; für Textlinks ggf. zusätzlich underline.",
      "Focus states immer sichtbar (Ring in Rot + Offset)."
    ],
    "touch_targets": "Min 44px Höhe für Buttons in Sticky Bars.",
    "content_safety": "18+ Modal muss keyboard-navigierbar sein (AlertDialog).",
    "aria": [
      "Kontaktbuttons: aria-label mit Kanal + Profilname.",
      "Filter Selects: label + aria-describedby für Hinweise."
    ]
  },

  "performance": {
    "rules": [
      "Bilder: responsive sizes + lazy loading + blur placeholder (wenn möglich).",
      "Keine großen Video-Heros.",
      "Noise Overlay rein CSS (kein PNG).",
      "Keine globalen Animationen; keine ""transition: all""."
    ],
    "image_handling": {
      "listing": "Nutze kleinere Thumbnails (z.B. 480w) und srcSet.",
      "profile": "Fullscreen lädt hochauflösend erst beim Öffnen."
    }
  },

  "image_urls": {
    "hero_background_candidates": [
      {
        "url": "https://images.unsplash.com/photo-1650139504276-fa19cc7c84be?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBwb3J0cmFpdCUyMG5lb24lMjByZWQlMjBsaWdodHxlbnwwfHx8cmVkfDE3NzU5MzI0NTd8MA&ixlib=rb-4.1.0&q=85",
        "category": "hero",
        "description": "Moody portrait with red neon wash; use as subtle blurred hero backdrop behind search (opacity 0.18 + heavy blur)."
      },
      {
        "url": "https://images.unsplash.com/photo-1650139504331-9bc867a86b3b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxkYXJrJTIwbW9vZHklMjBwb3J0cmFpdCUyMG5lb24lMjByZWQlMjBsaWdodHxlbnwwfHx8cmVkfDE3NzU5MzI0NTd8MA&ixlib=rb-4.1.0&q=85",
        "category": "hero",
        "description": "Red wall portrait; crop as abstract texture panel (avoid explicit imagery)."
      }
    ],
    "profile_placeholder": [
      {
        "url": "https://images.unsplash.com/photo-1607540455062-c2f8633f0b94?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxkYXJrJTIwbW9vZHklMjBwb3J0cmFpdCUyMG5lb24lMjByZWQlMjBsaWdodHxlbnwwfHx8cmVkfDE3NzU5MzI0NTd8MA&ixlib=rb-4.1.0&q=85",
        "category": "fallback",
        "description": "Fallback portrait for empty states / skeleton preview (keep subtle)."
      }
    ]
  },

  "page_blueprints": {
    "homepage": {
      "sections": [
        "Header (sticky)",
        "Hero: H1 + H2 + Search + Quick Filters (sticky filter bar starts here)",
        "Profile Grid (pagination)",
        "Städte in NRW (SEO links)",
        "CTA Bewerberinnen (Card mit klarer Copy)",
        "Footer (Impressum/Datenschutz/AGB immer sichtbar)"
      ],
      "hero_copy": {
        "h1": "NRW. Direkt. Diskret.",
        "h2": "Finde Profile in deiner Stadt – schnell filtern, sofort kontaktieren.",
        "cta": "Jetzt suchen"
      }
    },
    "profile_detail": {
      "sections": [
        "Breadcrumbs",
        "Gallery",
        "Key Facts (Stadt, Alter, Kategorie, Verfügbarkeit)",
        "Beschreibung",
        "Kontakt (Desktop sticky card)",
        "Sticky Contact Bar (mobile)",
        "Ähnliche Profile"
      ]
    },
    "city_region_category": {
      "sections": [
        "Breadcrumbs",
        "SEO Intro (kurz, 2-3 Sätze)",
        "Sticky Filter Bar",
        "Profile Grid",
        "Pagination",
        "Interne Navigation (Städte/Regionen/Kategorien)"
      ]
    },
    "legal_pages": {
      "tone": "Clean, readable, still dark.",
      "layout": "max-w-3xl prose-invert (oder custom) mit klaren H2/H3"
    },
    "admin": {
      "login": "Centered card, aber nicht App-weit zentrieren; nur Login-View.",
      "dashboard": "Tabs + Tables + Dialogs für CRUD"
    }
  },

  "libraries_and_integrations": {
    "recommended": [
      {
        "name": "framer-motion",
        "why": "Nur für 1-2 leichte Entrance/Presence Animationen (Modal/Sheet), optional.",
        "install": "npm i framer-motion",
        "usage": "Nur dort einsetzen, wo shadcn Dialog/Sheet nicht reicht. Respect prefers-reduced-motion."
      }
    ],
    "do_not_use": [
      "Heavy particle backgrounds",
      "Three.js hero",
      "Large Lottie loops on listing pages"
    ]
  },

  "instructions_to_main_agent": [
    "Setze App standardmäßig in .dark (z.B. <html className=\"dark\"> oder root wrapper).",
    "Ersetze die aktuellen :root Tokens in index.css (die sind aktuell light-first) durch die oben definierten dark Tokens oder stelle sicher, dass .dark immer aktiv ist.",
    "Implementiere Grain Overlay via body::before (CSS-only). Achte auf z-index (#root über Overlay).",
    "Baue Sticky Filter Bar als eigenes Component (z.B. <StickyFilterBar />) und reuse auf Listing Pages.",
    "Profile Cards: Bilddominanz + Bottom Gradient Overlay + 3 CTAs. Alle CTAs mit data-testid.",
    "Profilseite: Carousel + Fullscreen Dialog. Sticky Contact Bar mobile fixed bottom.",
    "18+ Modal: AlertDialog beim ersten Besuch (localStorage Flag).",
    "SEO: Helmet Async pro Landingpage (Title, Description, canonical). Breadcrumbs überall.",
    "Keine ""transition: all"". Transitions nur gezielt (background-color, box-shadow, opacity, transform).",
    "Keine externen CDNs. Google Fonts via @import oder <link> im index.html (lokal bevorzugt, falls Setup vorhanden)."
  ]
}

---

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
