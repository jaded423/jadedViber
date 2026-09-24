---
type: log
title: jadedViber Changelog
tags: [jadedviber, changelog, history]
related: [index, site-reference]
---

# Changelog

All notable changes to jadedViber are documented here.

---

## 2026-09-23 - /work/ case study #4: TCT, a compliance portal that keeps the batch trail

**What changed:**
- New `work/compliance-portal.html` = plan page 4, on the `blog-from-a-doc.html` pattern: story cards (problem / built / changed; "four core modules from whiteboard photos to a running portal in two days" = `tct/docs/changelog.md` Phase 1–4 entries dated 2026-04-02 → 04-03), then the lot-number walk (run screenshot → batch screenshot), a Claude-drawn inline SVG of the trail (ingredient §300.206 → master record §300.204 → individual batch §300.205 → production run → label §300.402, the lab §300.301 feeding both ends, a dashed pink "inspector reads it back" line), the five enforced rules, the public COA page, multi-company + branding, the real login screen, "where it stands", stack, "built in conversation".
- **Accuracy fences, each checked in `tct/site` code:** no-COA-no-batch (`ProductionController::storeIndividual`), runs only from `complete` batches, targets frozen per batch, 3-year `retention_expires_at`, 32 distinct `AuditLog::record` events ("more than thirty"). COAs *can* be deleted, so the page says "can be archived instead of deleted", not "never deleted". Recall plans + audit reports are said plainly to be unbuilt; the app's own login screen advertises "Audit-ready exports", and the page's prose does not repeat that claim.
- **Capture sitting:** `tct` is not a git repo (CLAUDE.md "Repo: TBD"), so there was no branch to make; the scratch copy lived in the session scratchpad instead and the TCT tree is untouched. `site/` copied without `.env` → fresh sqlite `.env` → `php:8.3-cli` in Docker (local PHP 8.5 has no `pdo_sqlite`; no sudo install) → migrate → a throwaway `CaptureSeeder` (invented org "Bluebonnet Botanicals (demo)", invented suppliers/labs, `.example` emails, `DEMO-41xx` sales orders) + a scratch-only `/_capture/login/{id}` route → headless Chromium at 1280. Container removed afterwards. The page states the screenshots come from a local copy with made-up records.
- **The repo's `login*.png` set was not used:** they are AI-generated design mockups (misspellings like "All broners", "Chpter 30"), not captures. The real `/login` view was captured from the local run instead.
- New `work/img/`: `tct-run.png` 78 KB, `tct-batch.png` 88 KB, `tct-public-coa.png` 40 KB, `tct-login.png` 276 KB (1000 wide truecolor; 256-colour quantize banded the gradient), `tct-og.png` 1200×630 76 KB = the page's og/twitter image (first `/work/` page with its own).
- `work/work.css` gains `.shot` / `.shot.narrow` figures (width 100%, never a scroll). `work/index.html` TCT card is now a live link. `sitemap.xml` + `llms.txt` list the page. `palette.js` `PAGES` gains page 3 (missed last session) and page 4; `?v=2 → 3` on all nine pages that load it. `docs/site-reference.md`: cache-bust line no longer says "seven pages"; new screenshot rule under the no-scroll rule.
- Checked before push: title 55 / description 147, canonical + OG + Twitter + JSON-LD, all 4 `<img>` have alt text; headless Chromium iframes at 390 and 320 wide → `scrollWidth == clientWidth`, no element past the right edge.

**Why:** plan `~/.claude/plans/jadedviber-portfolio.md` page 4.

**Files:** `work/compliance-portal.html` (new), `work/img/tct-*.png` (new), `work/work.css`, `work/index.html`, `sitemap.xml`, `llms.txt`, `palette.js`, every page's `palette.js?v=`, `docs/site-reference.md`.

---

## 2026-09-23 - /work/ case study #3: Point 4, a blog you write from one Google Doc

**What changed:**
- New `work/blog-from-a-doc.html` = plan page 3: the Point 4 Doc → n8n → Webflow round trip told from the writer's chair. Story cards (problem / built / changed; the "ten posts by the owner's team without me in the room" number is `fathom/value-log.md` §5). **Picture A** = a Claude-drawn inline-SVG mockup in the site palette: the MASTER Doc with the Point 4 menu open (Publish · Open Blog Picker · New / Clear Doc), the fenced header block with the Post ID / Slug notes, skeleton body + one red-ruled quote + the NOTES fence, the Blog Picker sidebar (dropdown + red Pull button, as the bound script draws it), and the resulting post page with its pooled cover; Publish → / ← Pull. **Picture B** = the round-trip SVG: Doc ⇄ publisher (Publish / Pull / List / Rescan branches, 28 nodes) ⇄ Webflow, the photo pool below the Doc, Beehiiv as a detached dashed box. Then the writer's four steps, the two rules (Post ID identity, slug frozen at first publish), photo rotation (never-used first → oldest `used_at` → random tiebreak; body image wins; asset id reused), the handoff section, stack pills, "built in conversation". Every fact from `point4Core/{README,AUTHORING,RUNBOOK}.md` + the live export; no staff names on the page (roles only, same as the package).
- **Beehiiv fence honored:** the page says signup forms + the newsletter live on Beehiiv alongside the site, that it is not connected to the blog, and that the newsletter-from-the-blog leg was designed and never built. No Doc→Beehiiv edge anywhere. point4pi not mentioned (sibling card later, per the plan).
- **Same day, Joshua:** "designed but never built" reads as abandoned; the blog→newsletter leg is a planned next step, and the reason it is not built yet stays off the page. Reworded everywhere it appeared (caption, the handoff paragraph, the Beehiiv box label "next up: the blog feeds the newsletter", both SVG aria-labels, `llms.txt`) to a designed-and-waiting next step. The fence still holds: Beehiiv is drawn detached, no Doc→Beehiiv edge, and the page still says it is not wired today.
- `work/index.html`: the Point 4 card is now a live link, status line rewritten. `sitemap.xml` + `llms.txt` list the page.
- Checked before push: title 57 / description 156 chars, canonical + OG + Twitter + JSON-LD (`WebPage` → `SoftwareApplication`, Person `#identity`, breadcrumbs), headless Chromium at 1280 and 390 wide → scrollWidth == clientWidth and no SVG `<text>` exits its viewBox (site rule: no horizontal scroll; both diagrams scale to the container).

**Why:** plan `~/.claude/plans/jadedviber-portfolio.md` page 3; Cody review comes after this page.

**Files:** `work/blog-from-a-doc.html` (new), `work/index.html`, `sitemap.xml`, `llms.txt`.

---

## 2026-09-23 - Site rule: no horizontal scroll, anywhere

**What changed (Joshua: "they should never exist"):** every `overflow-x: auto` on the site is gone. `work/work.css` diagrams scale to the container (no `min-width`, `overflow: hidden`); `homelab.css` topology wrapper likewise and `#topology` lost its 600px `min-width`; `projects/photo-editor.html` `pre` blocks are `pre-wrap` + `overflow-wrap: anywhere`, and the architecture tree's comments were shortened so desktop never wraps; the tribute tape wrap is `overflow: visible` (cells already size to the viewport on phones). Tradeoff accepted: on a phone the pipeline diagram is a thumbnail; rotate the phone for detail.

---

## 2026-09-23 - photo-editor page refreshed to the Sept-2026 app (focal cut, no webhook, Releases)

**What changed:** `projects/photo-editor.html` rewritten section by section against the photoEditor repo as it stands (the elevatedCore refactor did NOT touch the app; the app's own history did): focal cut (SAM + BiRefNet, 2026-09-04) leads the pipeline list + a "two models must agree" paragraph; the webhook/settings window is gone (stripped 2026-06-30) so title/description/OG/JSON-LD/config cards no longer claim it; "Configuration" → "Who runs it" (photographer · the 15-min tick watches the folder · company fork · logs); install points at GitHub Releases on the Elevated org (`v1.0.0`, `latest` link); architecture tree + 36 deps; stack pills gain SAM/BiRefNet/OpenCV/onnxruntime; nav + crosslinks gain Work; page links to `/work/photo-to-web.html` as its front door. **Overflow fix** (Joshua's screenshot): inline `code` now `overflow-wrap: anywhere`, feature cards `min-width: 0`.

---

## 2026-09-23 - Command palette + Turing tribute (replaces the binary-counter widget)

**What changed:**
- `palette.js` (new, loaded on every content page): `/`, `Ctrl+K`, a `/` chip injected into the nav (wraps links + chip + hamburger in `.nav-right`), or `#search` → a jump-to-page palette. Typing `turing` with no match opens the tribute.
- `turing.js` (rewritten): full-screen tribute — frozen ASCII portrait (seed `turing.jpg`, PD 1928 school photo), name, dates, one quote, and a 32-cell tape running a binary-increment machine whose value is the seconds since the CNAME commit (2026-03-10 12:06:18 CST). Triggers: typed `turing` (kept), the palette, `#turing`. Esc / × / backdrop closes. No controls on purpose (Joshua: "less interactive, more flash").
- Docs: `site-reference.md` § Interactive features (regen recipe + epoch), README, CLAUDE.md tree.
- **Same day, after Joshua's phone check:** (1) `/` was losing to the browser's quick-find → palette listens in the capture phase on both keydown and keypress. (2) The first portrait (ascii-image-converter, mid-gray paper background rendered as mid-density glyphs) was unreadable → new generator `scripts/turing-portrait.py` (Pillow, `~/.venvs/elevated`): head-and-shoulders crop, unsharp, **inverted** so hair/eyes/shadows are the glyphs and the paper goes blank, luminance floor, and tone buckets `t0..t4` tinted in the palette (spans, `innerHTML`). Joshua saw A (thin) vs B (colour) side by side; B shipped.
- Follow-ups the same evening: script tags carry a version query (`palette.js?v=N`, `turing.js?v=N`; bump on every change — Pages caches 10 min and a phone reload otherwise shows the old file); tribute tape cells size to the viewport under 520px (no scrollbar); the homepage roadmap card + source comment that announced the easter egg are removed (Joshua: keep it sneaky).

**Why:** Joshua's Hyprland setup eats a bare `t`, and phones have no keyboard, so the typed trigger needed a clickable and linkable door; the palette is that door and a real nav improvement on its own. The counter as a hidden est.-date was Joshua's addition.

**Files:** `palette.js`, `turing.js`, `turing.jpg`, script tags in `index.html` · `homelab.html` · `now.html` · `now-archive.html` · `projects/photo-editor.html` · `work/*.html`, `docs/site-reference.md`, `README.md`, `CLAUDE.md`.

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
