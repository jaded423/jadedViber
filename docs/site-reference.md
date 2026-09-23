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
- 5x Google MX (`aspmx.l.google.com` + alt1–4) + 2x `google-site-verification` TXT — the **jadedviber.com Google Workspace org** (Business Starter, re-subscribed 2026-09-16; admin/primary `j@jadedviber.com`, `joshua@` alias; brain `jadedviber-workspace-org`)
- `@` TXT `v=spf1 include:_spf.google.com ~all` (SPF) + `google._domainkey` TXT (DKIM, 2048) — added 2026-09-16 via the Cloudflare API from pi-gw1's zone token (the DNS edit path for this zone: brain `jadedviber-dns-edit-path`)

DNSSEC: off (was off before the move; leave it unless re-enabled through Cloudflare).

## OAuth / app pages (added 2026-06-17)

Built so the Google-account-automation tooling (served from other repos) has the public-facing pages Google's OAuth consent + branding flow requires. Clean paths (`/app`, `/privacy`, `/terms`) are `dir/index.html` — GitHub Pages (no Jekyll) serves them without the `.html`. All match the Dracula theme + nav/footer pattern from `projects/photo-editor.html`.

- **`/app`** — home page. H1 is exactly **"JadedViber"** (must match the OAuth consent-screen app name). Explains purpose + lists requested Google scopes. This is the URL to set as the Google "Application home page".
- **`/privacy`** — privacy policy. Contains the verbatim **Google API Services Limited Use** disclosure (data not sold/shared/used for ads, not used to train models). Effective 2026-06-17, contact jaded423@gmail.com.
- **`/terms`** — terms of service.
- **`snek-ascii-hq.png`** (780px, width-55 chars — same look as the nvim dashboard) and **`snek-ascii-xl.png`** (1410px, width-100) — high-res ASCII snek on pure `#000000`, for external branding (Uptime Kuma status-page logo, etc.). There is no stored ASCII source: the ASCII is rendered from `snek.png` by `ascii-image-converter` (the `-C -c -W 55` recipe the nvim dashboard uses). `snek-ascii.png` (470px) is the old screenshot used by the index easter egg — leave it. Regenerate:
  `~/projects/go/bin/ascii-image-converter snek.png -C -c -W 55 --only-save -s . --save-bg 0,0,0,100` (the 4th `--save-bg` value is opacity 0–100, not alpha 0–255).
- **`snek-ascii-icon.png`** (1024×1024, 16-colour palette, ~82 KB — Kuma's socket.io status-page save silently times out past ~100 KB) — the ASCII snek as a **maskable app icon**: rendered at 1400 then downsized, jet black edge to edge, glyphs brightened ×2 and thickened, snek filling ~86% so it survives Android's ~48 px circle crop. Regenerate: `python3 scripts/snek-icon.py`. Only reads as intended when the web-app manifest marks the icon `"purpose": "any maskable"` — Chrome pads any non-maskable icon onto a white disc (the 'small snek with a white border' look). Uptime Kuma's status-page manifest does not set that; the fix lives in piGate's appliance (see piGate TODO).
- **`snek-logo.png`** — the seed composited on the site background, for the Google OAuth consent card ONLY (it is not the brand mark and not an app icon — the brand is the ASCII render). Use this (not `snek.png`) there: `snek.png` is transparent and renders **white** on Google's light consent card; the logo version is composited on the site's `#0a0a0a` background.

The tooling that consumes these pages lives in another repo and is owned by a separate session — this repo only hosts the static pages + logo.

## Design

- **Theme**: Dracula palette on `#0a0a0a` background.
- **Font**: SF Mono / Fira Code / monospace stack.
- **Colors**: Green (`#50fa7b`), Cyan (`#8be9fd`), Purple (`#bd93f9`).
- **Branding**: Snek mascot, "All vibe. No grind." tagline.

## Interactive features

- **Snek easter egg**: click logo → scanline block transition to ASCII art → fade back.
- **Command palette** (`palette.js`, every content page; not the OAuth legal pages): `/` or `Ctrl+K`, the `/` chip in the nav (tap target for phones and for boxes where a compositor bind eats `t`), or `#search`. Jumps between pages (list = `PAGES` in the file). A query that matches nothing and reads `turing` opens the tribute.
- **Turing tribute** (`turing.js`, every content page; replaced the 2026-05 binary-counter widget 2026-09-23): type `turing`, search it in the palette, or open `#turing`. Full-screen: ASCII portrait (frozen in the file as tone-tinted spans; regen = `~/.venvs/elevated/bin/python scripts/turing-portrait.py <outdir>` → paste `portrait-colour.html` into `PORTRAIT` JSON-escaped; seed = `turing.jpg`, the public-domain 1928 school photo from Wikimedia Commons `Alan_Turing_Aged_16.jpg`; inverted + tone buckets `t0..t4` because a light-paper photo on a dark page needs the shadows to be the ink), name, 1912–1954, one quote, and a 32-cell tape running a binary-increment machine. **The number on the tape is the seconds since the site went live** (`EPOCH_S = 1773162378` = the CNAME commit, 2026-03-10 12:06:18 CST) — deliberately unexplained on the page; every visitor sees the same count. Head sits at the least-significant bit; an increment walks left through the carry and back. If the tab sleeps and the tape falls >15 s behind the clock it resyncs silently.
- **Stack terminal reveal**: scroll into view → 20x20 grid blocks disappear left-to-right, row-by-row.
- **Nav**: fixed top bar with smooth scroll to sections.
