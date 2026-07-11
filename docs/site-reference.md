---
type: reference
title: jadedViber Site Reference
tags: [jadedviber, dns, oauth, design, github-pages]
related: [index, changelog]
---

# jadedViber Site Reference

Cold reference for the jadedviber.com static site (DNS records, OAuth/app pages, design tokens, interactive features). Extracted from CLAUDE.md on 2026-07-08. Current-state hosting summary + the DNS gotcha stay in [../CLAUDE.md](../CLAUDE.md).

## DNS (Squarespace registration, Google Domains nameservers)

Nameservers are Google Domains (`ns-cloud-c1-4.googledomains.com`), not Squarespace.

Custom records:
- 4x `@` A records → GitHub Pages IPs (185.199.108-111.153)
- `www` CNAME → `jaded423.github.io`
- `_github-pages-challenge-jaded423` TXT → domain verification
- `dns` A → `192.168.68.250` (pihole, unrelated)
- `_acme-challenge.dns` TXT (pihole cert, unrelated)

**Keep**: Google Workspace MX records, Google Workspace Verification TXT.

## OAuth / app pages (added 2026-06-17)

Built so the Google-account-automation tooling (served from other repos) has the public-facing pages Google's OAuth consent + branding flow requires. Clean paths (`/app`, `/privacy`, `/terms`) are `dir/index.html` — GitHub Pages (no Jekyll) serves them without the `.html`. All match the Dracula theme + nav/footer pattern from `projects/photo-editor.html`.

- **`/app`** — home page. H1 is exactly **"JadedViber"** (must match the OAuth consent-screen app name). Explains purpose + lists requested Google scopes. This is the URL to set as the Google "Application home page".
- **`/privacy`** — privacy policy. Contains the verbatim **Google API Services Limited Use** disclosure (data not sold/shared/used for ads, not used to train models). Effective 2026-06-17, contact jaded423@gmail.com.
- **`/terms`** — terms of service.
- **`snek-logo.png`** — use this (not `snek.png`) for the OAuth logo. `snek.png` is transparent and renders **white** on Google's light consent card; the logo version is composited on the site's `#0a0a0a` background.

The tooling that consumes these pages lives in another repo and is owned by a separate session — this repo only hosts the static pages + logo.

## Design

- **Theme**: Dracula palette on `#0a0a0a` background.
- **Font**: SF Mono / Fira Code / monospace stack.
- **Colors**: Green (`#50fa7b`), Cyan (`#8be9fd`), Purple (`#bd93f9`).
- **Branding**: Snek mascot, "All vibe. No grind." tagline.

## Interactive features

- **Snek easter egg**: click logo → scanline block transition to ASCII art → fade back.
- **Stack terminal reveal**: scroll into view → 20x20 grid blocks disappear left-to-right, row-by-row.
- **Nav**: fixed top bar with smooth scroll to sections.
