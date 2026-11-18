# AGENTS.md

## Project Identity
- **Name:** Adit Jain
- **Role:** Software Engineering student, Robotics Enthusiast, Co‑founder of Maggieaurcode
- **Purpose:** Premium cinematic personal portfolio showcasing verified work, research, and projects.

## Design System
- **Palette:**
  - Charcoal `#1E1E1C`
  - Sand `#D8CBB3`
- **Typography:**
  - Headings: *Space Grotesk* (oversized, editorial weight)
  - Body: *DM Sans* (clean, legible)
- **Layout Principles:**
  - Asymmetric compositions with deliberate whitespace
  - Editorial‑style layouts, large typography, real photography
  - No generic AI templates, rounded cards, purple‑blue gradients, glowing blobs, fake terminals, or stock avatars.
- **Copy Guidelines:**
  - Use only verified facts from resume and supplied project materials.
  - Avoid invented awards, metrics, testimonials, and unnecessary em‑dashes.

## Tech Stack
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Custom CSS (no CSS‑in‑JS frameworks)
- **Animations:** GSAP, ScrollTrigger, SplitText, `@gsap/react`
- **Routing:** React Router
- **Icons:** Lucide React

## Content Policy
- Pull directly from **verified resume** and **provided project assets**.
- Clearly label each item as:
  - **Production** (deployed, live)
  - **Prototype** (experimental, not shipped)
  - **Research** (exploratory, in‑progress)
- No fabricated achievements or performance numbers.

## Animations
- Purposeful, premium‑feel animations using GSAP timelines.
- Ensure proper cleanup of timelines and ScrollTrigger instances.
- Provide reduced‑motion support via `prefers-reduced-motion` media query.
- Mobile animations must be lighter and never hijack native scrolling.

## Responsiveness


## Accessibility
- Provide reduced‑motion support via `prefers-reduced-motion` media query (already enforced in Animations).
- Ensure sufficient color contrast between Charcoal `#1E1E1C` text and Sand `#D8CBB3` backgrounds.
- Use semantic HTML elements and descriptive ARIA labels where needed.
- Avoid content that relies solely on visual cues; include text alternatives for images.

## Design Constraints (Never Use)
- Generic AI website templates, rounded cards, purple‑blue gradients, glowing blobs.
- Fake terminal interfaces, fabricated metrics, stock developer avatars, excessive glassmorphism.
- Unnecessary em‑dashes and invented awards, testimonials, or performance numbers.



## Performance
- Optimize real images (compress, use modern formats like WebP/AVIF).
- Lazy‑load non‑critical assets and components.
- Keep dependencies minimal; only the listed stack.
- Audit with Lighthouse and address the critical metrics.

## Security
- Never commit API keys, deployment hooks, or private docs.
- Review any destructive terminal commands before execution.
- Ensure CSP headers and sanitization of any dynamic content.

## Workflow Phases
1. **Setup & Baseline** – scaffold Vite + React + TypeScript, commit initial repo.
2. **Core Layout** – implement global styles, typography, and navigation.
3. **Content Integration** – add verified project sections, photography, and copy.
4. **Animation Layer** – add GSAP timelines; test reduced‑motion.
5. **Responsive Refinement** – iterate on breakpoints, touch handling.
6. **Performance Tuning** – image optimization, lazy‑loading, audit fixes.
7. **Security Review** – final code audit, remove any secrets.
8. **Final QA** – inspect live site, fix errors, sign‑off.

> **Note:** After each phase, run the site locally, verify functionality, and resolve any issues before moving to the next phase.
