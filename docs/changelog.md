---
type: log
title: jadedViber Changelog
tags: [jadedviber, changelog, history]
related: [index, site-reference]
---

# Changelog

All notable changes to jadedViber are documented here.

---

## 2026-09-12 - snek-ascii-icon.png: the ASCII snek as a maskable phone/app icon

**What changed:**
- New `snek-ascii-icon.png` (1024×1024, 16-colour palette, ~82 KB): the ASCII render of the seed snek, trimmed, brightened ×2, strokes thickened, jet black edge to edge, snek filling ~86% of the square.
- New `scripts/snek-icon.py` regenerates it from `snek.png` (ascii-image-converter `-C -c -W 55`, same recipe as the nvim dashboard) — every render differs a little on purpose.
- `docs/site-reference.md` asset list + `CLAUDE.md` asset line updated.

**Why:**
- The Uptime Kuma status page on pi-gw1 uses it as the Android home-screen icon. It looked small inside a white disc — not the image's fault: Chrome pads any manifest icon lacking `"purpose": "any maskable"`. The icon side needed full-bleed black + heavier glyphs to survive the ~48 px launcher circle; the manifest side lives in piGate (Kuma patch). Joshua approved the look on the phone 2026-09-12.

**Technical notes:**
- Kuma's socket.io status-page save silently times out past ~100 KB, hence the palette/size cap. Pillow `optimize=True` made this image 4× larger; plain save + `quantize(16)` instead.
- Detail + regen recipe: `docs/site-reference.md`; brain `android-home-icon-white-border-maskable`.

---

## 2026-06-17 - OAuth app pages + logo

**What changed:**
- Added `/app`, `/privacy`, `/terms` as clean paths (`dir/index.html`, served
  without `.html` by GitHub Pages no-Jekyll). All match the Dracula theme + nav/
  footer from `projects/photo-editor.html`.
- `/app` — OAuth app home page, H1 "JadedViber" (matches OAuth consent app name),
  explains purpose + Google scopes requested.
- `/privacy` — privacy policy with verbatim Google API Services Limited Use
  disclosure (not sold/shared/ads, not used to train models). Effective 2026-06-17.
- `/terms` — terms of service.
- `snek-logo.png` — 512×512 mascot composited on `#0a0a0a` for the OAuth logo
  (transparent `snek.png` rendered white on Google's light consent card).
- Added all three pages to `sitemap.xml`.

**Why:** Google OAuth consent/branding flow requires a home page that explains
the app's purpose, plus privacy + terms URLs on the same verified domain.

## 2026-03-10 - Initial Site Launch

**What changed:**
- Created jadedviber.com landing page hosted on GitHub Pages
- Dark Dracula-themed single-page site with monospace font
- Hero section: snek.png mascot, gradient "JADED" title, "All vibe. No grind." tagline
- Projects section: 6 cards (nvimConfig public, 5 private showcases: odooReports, commandCenter, COA Extractors, OrphanedTasks, Loom SOP Pipeline)
- Stack section: tmux screenshot with block-by-block terminal reveal animation on scroll (20x20 grid, IntersectionObserver triggered)
- Stack grid: Editor, Terminal, AI, Homelab tool lists
- Snek ASCII easter egg: click logo to trigger scanline transition (color → black blocks → ASCII → fade back)
- Fixed top nav with smooth scroll anchors
- Responsive design for mobile

**DNS & Hosting Setup:**
- GitHub Pages on `master` branch (repo: jaded423/jadedViber)
- CNAME file for custom domain
- Squarespace DNS: removed Squarespace defaults, added 4x GitHub A records + www CNAME
- GitHub domain verification via `_github-pages-challenge-jaded423` TXT record
- SSL cert provisioned (Let's Encrypt via GitHub), HTTPS enforced
- Troubleshot Twingate/router DNS caching — resolved by setting Mac DNS to Google (8.8.8.8, 8.8.4.4)

**n8n Workflows Created:**
- `dns-check-jadedviber.json` — checks DNS propagation via dns.google API, emails on GitHub IP detection
- `ssl-check-jadedviber.json` — checks GitHub Pages API for `https_enforced`, emails when cert is live
- Added `N8N_EDITOR_BASE_URL=http://localhost:5678` to Omarchy's docker-compose to fix OAuth redirect mismatch
- Set up Google Cloud OAuth project ("Danger Zone") for n8n Gmail integration

**Other Changes:**
- Updated Neovim dashboard tagline from "Strike fast. Code faster!" to "All vibe. No grind." on all 5 machines (Mac, Book5, Omarchy, Tower, Ubuntu)
- Fixed ascii-image-converter on Ubuntu VM: removed snap version (sandbox permission denied on ~/.config), installed GitHub release binary to /usr/local/bin
- Captured OAuth URLs from nested tmux sessions for Claude Code login on Omarchy and Ubuntu

**Files created:**
- `index.html` — main site with hero, projects, stack sections + JS animations
- `style.css` — Dracula-themed responsive styles
- `snek.png` — color viper mascot (copied from nvimConfig)
- `snek-ascii.png` — ASCII art version for easter egg
- `stack-screenshot.png` — tmux setup screenshot for stack section
- `CNAME` — GitHub Pages custom domain config
- `docs/changelog.md` — this file

---
