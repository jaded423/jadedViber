---
type: reference
title: jadedViber Site Reference
tags: [jadedviber, dns, oauth, design, github-pages]
related: [index, changelog]
---

# jadedViber Site Reference

Cold reference for the jadedviber.com static site (DNS records, OAuth/app pages, design tokens, interactive features). Extracted from CLAUDE.md on 2026-07-08. Current-state hosting summary + the DNS gotcha stay in [../CLAUDE.md](../CLAUDE.md).

## DNS (Squarespace registration, **Cloudflare nameservers** since 2026-09-10)

Registrar stays Squarespace; the zone moved to Cloudflare (free plan, account jaded423@gmail.com, nameservers `lamar.ns.cloudflare.com` / `thea.ns.cloudflare.com`, replacing `ns-cloud-c1-4.googledomains.com`) so a piGate box can get DNS-01 certificates for names under the domain. **Every record is DNS-only (grey cloud)** — GitHub Pages serves its own certificate and must not be proxied.

Records (17):
- 4x `@` A records → GitHub Pages IPs (185.199.108-111.153)
- `www` CNAME → `jaded423.github.io`
- `_github-pages-challenge-jaded423` TXT → GitHub domain verification (Cloudflare's import scan missed this one — added by hand)
- `status` A → `100.104.88.96` — **pi-gw1's Tailscale IP**: `https://status.jadedviber.com/` is the piGate Uptime Kuma status page, reachable only from the tailnet, cert via Caddy + Cloudflare DNS-01 (token scoped Zone:DNS:Edit on this zone only, stored on the Pi). Owner: `~/projects/piGate` (`networks/home-dryrun.md`).
- `dns` A → `192.168.68.250` (pihole, unrelated) · `_acme-challenge.dns` TXT (pihole cert, unrelated; carried over)
- `_domainconnect` CNAME → Squarespace's domain-connect hook (harmless)
- 5x Google MX (`aspmx.l.google.com` + alt1–4) + 2x `google-site-verification` TXT — Workspace leftovers, kept

DNSSEC: off (was off before the move; leave it unless re-enabled through Cloudflare).

## OAuth / app pages (added 2026-06-17)

Built so the Google-account-automation tooling (served from other repos) has the public-facing pages Google's OAuth consent + branding flow requires. Clean paths (`/app`, `/privacy`, `/terms`) are `dir/index.html` — GitHub Pages (no Jekyll) serves them without the `.html`. All match the Dracula theme + nav/footer pattern from `projects/photo-editor.html`.

- **`/app`** — home page. H1 is exactly **"JadedViber"** (must match the OAuth consent-screen app name). Explains purpose + lists requested Google scopes. This is the URL to set as the Google "Application home page".
- **`/privacy`** — privacy policy. Contains the verbatim **Google API Services Limited Use** disclosure (data not sold/shared/used for ads, not used to train models). Effective 2026-06-17, contact jaded423@gmail.com.
- **`/terms`** — terms of service.
- **`snek-ascii-hq.png`** (780px, width-55 chars — same look as the nvim dashboard) and **`snek-ascii-xl.png`** (1410px, width-100) — high-res ASCII snek on pure `#000000`, for external branding (Uptime Kuma status-page logo, etc.). There is no stored ASCII source: the ASCII is rendered from `snek.png` by `ascii-image-converter` (the `-C -c -W 55` recipe the nvim dashboard uses). `snek-ascii.png` (470px) is the old screenshot used by the index easter egg — leave it. Regenerate:
  `~/projects/go/bin/ascii-image-converter snek.png -C -c -W 55 --only-save -s . --save-bg 0,0,0,100` (the 4th `--save-bg` value is opacity 0–100, not alpha 0–255).
- **`snek-ascii-icon.png`** (1400×1400) — the ASCII snek as a **maskable app icon**: jet black edge to edge, glyphs brightened ×2 and thickened, snek filling ~86% so it survives Android's ~48 px circle crop. Regenerate: `python3 scripts/snek-icon.py`. Only reads as intended when the web-app manifest marks the icon `"purpose": "any maskable"` — Chrome pads any non-maskable icon onto a white disc (the 'small snek with a white border' look). Uptime Kuma's status-page manifest does not set that; the fix lives in piGate's appliance (see piGate TODO).
- **`snek-logo.png`** — the seed composited on the site background, for the Google OAuth consent card ONLY (it is not the brand mark and not an app icon — the brand is the ASCII render). Use this (not `snek.png`) there: `snek.png` is transparent and renders **white** on Google's light consent card; the logo version is composited on the site's `#0a0a0a` background.

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
