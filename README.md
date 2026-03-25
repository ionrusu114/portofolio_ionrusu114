# Ion Rusu — Portfolio

Personal portfolio and automated project estimator for [ionrusu114.pro](https://ionrusu114.pro).

## Tech Stack

- **Frontend:** Vue 3, TypeScript 5.9, Vite 8, Tailwind CSS 4
- **Animations:** GSAP (ScrollTrigger, ScrollToPlugin), Three.js
- **AI:** Google Gemini API — multi-language project estimator with structured offer generation
- **Infrastructure:** Docker, Nginx, Traefik v3, Let's Encrypt SSL
- **CI/CD:** GitHub Actions — auto build & deploy on push to `main`

## Features

- Horizontal scroll SPA with 5 panels (Hero, About, Projects, Get Offer, Contact)
- Three.js animated particle background with scroll-reactive camera
- AI-powered project estimator chat with language selection, budget/timeline analysis, and automated offer delivery via Google Apps Script
- Fully responsive — mobile carousel for projects, adaptive layouts
- Rate-limited offer sessions (3 per browser)

## Architecture

```
src/
├── components/
│   ├── chat/          # AI chat UI (actions, offer card, contact form, typing indicator)
│   ├── intro/         # Intro overlay animations
│   ├── layout/        # Horizontal scroller, nav menu
│   ├── panels/        # 5 main panels (Hero, About, Projects, GetOffer, Contact)
│   ├── sections/      # Reusable page sections (chat interface, project cards, skills)
│   ├── three/         # Three.js background canvas
│   └── ui/            # Base components (buttons, tags, panels, chat bubbles)
├── composables/       # Reactive logic (scroll, animations, Gemini API, offer chat state machine)
├── data/              # Static data (projects, skills, personal info)
├── services/          # External service integrations (email webhook)
├── styles/            # Global CSS (Tailwind theme, base, components)
├── types/             # TypeScript interfaces and injection keys
└── views/             # Route-level pages
```

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
bun run preview
```

## Testing

```bash
bun run test
bunx vitest run
```

## Deployment

Automated via GitHub Actions on push to `main`:

1. Multi-stage Docker build (Bun + Nginx Alpine)
2. Push to Docker Hub (`ionrusu114/portfolio-front`)
3. SSH deploy to production server
4. Traefik reverse proxy with automatic SSL

### Environment Variables (GitHub Secrets)

| Variable | Description |
|----------|-------------|
| `VITE_APP_GEMINI_API_KEY` | Google Gemini API key |
| `VITE_APP_GAS_WEBHOOK_URL` | Google Apps Script webhook URL |
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `SSH_HOST` | Production server IP |
| `SSH_USER` | SSH username |
| `SSH_PRIVATE_KEY` | SSH private key for deployment |

## License

All rights reserved. This is a personal portfolio — not open source.
