---
type: log
title: jadedViber Changelog
tags: [jadedviber, changelog, history]
related: [index, site-reference]
---

# Changelog

All notable changes to jadedViber are documented here.

---

## 2026-09-23 - /work/ portfolio gallery + first case study (photos-to-web pipeline)

**What changed:**
- New `work/` track, additive to the site (hero + Philosophy untouched, per Joshua): `work/index.html` = the client-facing gallery Cody can hand a client (six cards: Elevated photos→web pipeline · Point 4 blog-from-a-Doc · TCT compliance portal · Dax rep order portal · LLM cost gate · piGate; one live link, five "write-up coming"), `work/photo-to-web.html` = case study #1 (problem / built / changed cards, the elevatedCore tick + deploy diagrams recolored to Dracula and inlined, plain-words step list, handoff section), `work/work.css` = shared page styles (mirrors the `/projects/` inline styles).
- Homepage: **Work** nav link (first) + a two-card Work strip above Projects. `sitemap.xml` + `llms.txt` list both pages. `CLAUDE.md` site tree gains `work/`.
- Naming decided: Elevated / Point 4 / TCT / Dax named openly (Joshua shows Cody after creation).

**Why:** Cody's showcase ask (global TODO Leg 4) extended 2026-09-23 with "snapshots of the sites"; plan + page order + open decisions = `~/.claude/plans/jadedviber-portfolio.md`.

**Files:** `work/{index.html,photo-to-web.html,work.css}`, `index.html`, `sitemap.xml`, `llms.txt`, `CLAUDE.md`. Diagrams generated from `elevatedCore/docs/{tick,deploy}-light.svg` by a scratch script (recolor = style-block swap); regenerate the same way if the source SVGs change.

---

## 2026-09-16 - Landing-page thesis; jadedviber.com is a live Workspace org; SPF + DKIM

**What changed:**
- `index.html` Philosophy block now leads with the thesis (Joshua's words, reworded): *"I have more ideas than know-how. So does almost everyone. The tools finally closed that gap, so I use them — the way a builder uses a concrete truck instead of a shovel. Everything on this site was made that way, on purpose."* Roadmap blog line no longer says "no AI slop" (Joshua: never label own work slop — it's the Luddite conversation, new era).
- **DNS**: SPF TXT `v=spf1 include:_spf.google.com ~all` + DKIM TXT `google._domainkey` (2048-bit) added on the Cloudflare zone via the API (pi-gw1's zone token). The old Google MX + site-verification records were "Workspace leftovers" — the Workspace org on this domain is now **live again** (Business Starter, admin `j@jadedviber.com`).
- Site direction (Cody 2026-09-16): jadedviber.com IS the showcase/value-log destination → `/projects/` pages queued: photo→web pipeline, headless-Claude cost gate, piGate, Point4 Doc→Webflow flow (global TODO Leg 4). Cartoony step illustrations wanted (NotebookLM/Nano Banana candidate).

**Why:** Cody's "make a showcase site" advice + the org needed for a non-expiring OAuth app.

**Files modified:** `index.html`, `docs/site-reference.md` (DNS section). Zone edits are remote (Cloudflare).

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
