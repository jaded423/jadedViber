---
type: log
title: jadedViber Changelog
tags: [jadedviber, changelog, history]
related: [index, site-reference]
---

# Changelog

All notable changes to jadedViber are documented here.

---

## 2026-09-23 - projects/trans.html: the sermon follow-along kit, what/why/when only

**What changed:**
- New `projects/trans.html` = the trans stack's page, written for a church elder who runs the channel: hero + four stat tiles → three story cards (problem / what it is / where it stands) → a phone + index **mockup** SVG (invented sermon titles; the live instance belongs to a real church that is not named) → *Why I built it* → *The shape, without the recipe* (four boxes + what stays private) → *Where it stands* timeline (spring → Jul → Sep 19 / 20 / 23 → next) → *For a church* (what you get / what stays yours / what it costs) → *Also in the kit* → outline-only stack pills → CTAs. **No recipe by design** (Joshua: "don't give away the farm"): no engine or model names, no host names, no schedule detail, no repo link. Facts + decisions from `trans/TODO.md` and `~/.claude/plans/trans.sermon-saas.pot-plan.md` (free app, donations welcome, church owns its data, own box, no licensed Bible text in a public build).
- Reuses `work/work.css` + `homelab.css` (stat tiles, timeline); page-only CSS inline (`.terms`, `.feature-grid`).
- `homelab.html`: the sermons diagram no longer names the engine ("transcribed locally, nothing to the cloud"); the section links the new page.
- Homepage: a Sermon follow-along project card; the Person JSON-LD gains `hasOccupation` + `knowsAbout` (the leftover the /work/ session handed to T0).
- `palette.js` gains the page; `?v=5 → 6` on every page that loads it. `sitemap.xml` + `llms.txt` list it.
- **Open:** the CTA "Talk to me about your church" points at the GitHub profile because the site publishes no email; swap for a mailto or a form when Joshua picks one. `projects/trans-og.png` is cut from the mockup.

**Why:** Joshua (T0, 2026-09-23): "Can we look at adding the trans stack to a page? … neither mentioned in MCP or Sermons … a really cool piece of kit that I want to monetize/donate to churches. So I would like the what/why/when without the strict details on HOW, don't give away the farm."

**Files:** `projects/trans.html` (new), `projects/trans-og.png` (new), `index.html`, `homelab.html`, `palette.js`, every page's `palette.js?v=`, `sitemap.xml`, `llms.txt`, `CLAUDE.md`, `docs/changelog.md`

---

## 2026-09-23 - homelab.html rebuilt: current-state facts + the /work diagram style

**What changed:**
- `homelab.html` rewritten in the case-study shape (`work/work.css` linked for the hero, story cards, diagram frame, pills, CTAs; `homelab.css` keeps the page-only parts: stat tiles, map, panel, timeline). Sections: hero + six stat tiles → **the map** → three story cards → *How I reach it* → *Where the bytes live* → *What happens when tower hangs* → *One small thing it serves* (sermons) → *2026 so far* timeline → stack → CTAs.
- **The map** (`homelab.js`) is data-driven again but drawn in the same vocabulary as the /work SVGs (rounded boxes, labeled edges, arrow markers, section captions): the roaming fleet → Tailscale/Twingate → pi-gw1 / Flint 3 / Deco → one LAN bus → book5 and tower as group boxes holding their guests (VM 100, CT 316, CT 103, host jobs · VM 101, VM 111, media-pool, host jobs) → pihole / cameras / PC + WSL / pi1. Click = detail panel; hover = the touching edges light up, the rest dim; staggered entrance, honours `prefers-reduced-motion`; sideways scroll under 700 px.
- Four static inline SVGs, hand-placed like the /work pages: the access model (Tailscale direct / via pi-gw1 / ProxyJump / Twingate, plus "the rule"), storage (tower ZFS → NFS → VM 101 → consumers), the crash chain (regression → pin → panic → 30 s reboot → pstore/syslog, plus the three watchdogs), and the sermons pipeline (Pocket → CT 316 → pi-gw1 Caddy → phone).
- Current-state facts from `homeLab/wiki` replace the May-era text: Flint 3 router (2026-09-23), Deco as AP, pi-gw1 subnet router, CT 316 on book5, pi1 home since August (no longer offsite), the Pocket as daily driver, the Mac retiring, the tower-watchdog smart-plug power-cycle, 17 services on VM 101. Deliberately absent: LAN/tailnet IPs, MACs, SSIDs, usernames, admin URLs.
- `homelab-og.png` (new, 1200×630) = the top of the map; og/twitter/JSON-LD images point at it. JSON-LD gains `BreadcrumbList` + `dateModified`. `sitemap.xml` lastmod → 2026-09-23. Nav gains the Work link like every other page.
- Checked before push: headless Chromium renders at 1240 px, 23 map nodes present, no label collisions after three shortenings (book5 header, two fleet subtitles, the NFS labels, the sermons sync sub-label).

**Why:** Joshua (T0 session, 2026-09-23): "take a look at the homeLab page and think about updating it with current setup info, and also upgrading its diagrams to resemble the better ones on elevatedCore and Point 4 … that whole page could get a revamp to look nicer and flashier."

**Files:** `homelab.html`, `homelab.css`, `homelab.js`, `homelab-og.png` (new), `sitemap.xml`, `CLAUDE.md`, `docs/changelog.md`

---

## 2026-09-23 - /work/ case studies #6 + #7: the LLM cost gate and piGate. The gallery is complete.

**What changed:**
- New `work/cost-gate.html` = plan page 6. Joshua's framing (this session): "headless claude should get a good mention there, it gave a more controllable cost variable than API on the loose." The page tells two gates: **when** (a free deterministic template tier from `elevatedCore/pipeline/web/describe.py`; Claude asked once per new in-stock item with both `_Descriptions` cells blank, from `web/seed/fill_descriptions.py` + `web/sheets_desc.py`; a human Override column that always wins) and **which door** (on a signed-in machine, `claude -p` with `ANTHROPIC_API_KEY=""` in the child process, so the call bills the subscription and cannot hit the meter, the pattern from `meeting/meeting/assistant/brain.py` and the `todo()` shell wrapper; the cloud VM has no sign-in so its calls are metered on Haiku, `run_full_sync.sh` STEP 4.5 since 2026-09-15). One SVG of the two gates + a strip of the three other automations the gate fronts (meeting brain, `brain/hooks/brain_autoextract.py`, the parked LiveRef 3.0 COA extractor). No numbers on the page: the value log's `[calls × tokens × price]` is still a placeholder.
- New `work/pigate.html` = plan page 7. **No client is named** (Joshua: BeWell is a potential employer, no consent; the church is "a church pilot", the medical group is not mentioned at all). Sources: `piGate/CLAUDE.md`, `docs/tailscale-mode.md`, `docs/first-visit.md`, `docs/demo-card.md`, `fleet/FLASH.md`, the T0 plan `just-a-thought-on-curious-treasure.md`; the one-pager's *shape* (what it is / what you get / can and can't see / first visit) is reused, its addressee is not. Two SVGs: the topology (site LAN untouched + the box → the client-owned Tailscale network → a phone and a granted laptop, plus a "who holds the keys" box) and the first-visit timeline (green dots = the box by itself, purple = the visit's work). **No kit photo exists on disk** (the only candidate upload was the Pocket), so the page is drawings only. Numbers used: under 3 min to tailnet (2m35s, 2026-09-09), four networks for discovery, under $100 of hardware ($91.97/kit).
- OG images `cost-gate-og.png` + `pigate-og.png` = each page's first diagram cropped to 1200×630.
- `work/index.html`: the last two pending cards are live links; **all seven gallery cards now resolve**. `sitemap.xml` + `llms.txt` list both. `palette.js` `PAGES` gains both; `?v=4 → 5` on all thirteen pages that load it.
- Checked before push: titles 59 / 58, descriptions 152 / 157, canonical + OG + Twitter + JSON-LD (`SoftwareApplication` for the gate, `Product` for piGate), no `<img>` (inline SVG with `aria-label`), headless Chromium iframes at 1280 and 390 wide → `scrollWidth == clientWidth`, no element past the right edge.

**Why:** plan `~/.claude/plans/jadedviber-portfolio.md` pages 6 + 7 (Joshua: "What is the next page? ... and then the last page?"). Leftovers for T0: the homepage Person `hasOccupation`, then step 9 (retire the plan file into this changelog, flip Leg 4).

**Files:** `work/cost-gate.html` (new), `work/pigate.html` (new), `work/img/cost-gate-og.png` + `work/img/pigate-og.png` (new), `work/index.html`, `sitemap.xml`, `llms.txt`, `palette.js`, every page's `palette.js?v=`.

---

## 2026-09-23 - /work/ case studies #5 + #5b: the Dax Distro order portal and the reps' lead app

**What changed:**
- New `work/rep-order-portal.html` = plan page 5 (daxOrder). Story cards (problem / built / changed), four real screenshots (order builder with three lines landing in the Gold tier; a rep's order list with one order expanded; Reports on All Time; the admin Inventory page with its ledger), a Claude-drawn inline SVG of the data path (rep's browser → PHP API → the one Google Sheet → email / WooCommerce / QuickBooks / Drive on a single bus), the seven enforced rules, "two builds in six weeks" (Apps Script + email/PIN live 2026-02-19 → PHP/Slim on Cloudways 2026-03-04 → Google sign-in 2026-03-05, all from `daxOrder/docs/changelog.md`), where it stands, stack, built in conversation.
- New `work/rep-leads-app.html` = plan page 5b (Joshua's ask this session: the AppSheet "DAX - Dialer Leads" app was missing from the plan). Two Claude SVGs, both labeled reconstructions: two phone screens (the deck + one lead with the Call / Email / Text & Log buttons, "+ Note", the activity list) and the lead's flow (first-version Python parser lane dimmed; second version = staging tab → Push Leads menu → the Sheet ⇄ the phone → Activity Log / Notes / Status → RepStats). Sources: `graveyard/dax-teardown-2026-07/appsheet-dax-dialer-leads/{README,SETUP}.md`, `appsheet/docs/{architecture,changelog}.md`, `graveyard/dax-teardown-2026-07/daxLeads/CLAUDE.md`. The "what didn't work" paragraph (AppSheet API plan-gated, push bot blind to script writes, deep links, the Playwright add-rep robot deleted on 2026-04-06) is straight from those docs.
- **Capture sitting (daxOrder):** the PHP-era SPA (`php/frontend/index.html`) copied to the session scratchpad with the Google client-id placeholder replaced; a Python `http.server` stub answering its eleven `/api/*` calls from a generated `fixtures.json`; a `scene.js` injected before `</body>` that seeds `daxRepSession` in localStorage and walks the app into `?scene=order|orders|reports|inventory`; headless Chromium at 1280 with a virtual-time budget; crops with ImageMagick. **Everything in the fixtures is invented, including the price and commission matrix** (the real one is in `PricingService.php` and is not on the page). The Dax logo in the header is the product as it was. No Wayback needed. Graveyard tree untouched.
- **Accuracy fences:** the leads page does not claim the Python parser fed the AppSheet sheet (the docs say leads were typed into the staging tab); the order page says email+PIN for v1 and Google sign-in for v2, matching the changelog; "the sensitive bits stay masked" = `CustomerService::maskField` on TaxID/LicenseNo; "server recomputes" = `OrderService::submitOrder` server-side recalc; "locks stock" = `LockService` Memcached mutex.
- New `work/img/`: `dax-order.png` 145 KB (1280×890), `dax-orders.png` 147 KB (1280×780), `dax-reports.png` 135 KB (1280×840), `dax-inventory.png` 210 KB (1280×1290), `dax-og.png` 162 KB and `dax-leads-og.png` 221 KB (both 1200×630).
- `work/index.html`: the Dax card is a live link and no longer says "email and PIN" or "leads flowed in from Gmail the same way"; a sixth card for the leads app follows it (seven cards total, two still pending). `sitemap.xml` + `llms.txt` list both pages. `palette.js` `PAGES` gains both; `?v=3 → 4` on all eleven pages that load it.
- Checked before push: order page title 55 / description 157, leads page 54 / 156; canonical + OG + Twitter + JSON-LD on both; all 4 `<img>` on the order page have alt text (the leads page has none, its pictures are inline SVG with `aria-label`); headless Chromium iframes at 1280, 390, and 320 wide → `scrollWidth == clientWidth` and no element past the right edge on either page.

- **Correction (Joshua, from his phone, same night):** the order page had the lineage backwards ("the same idea later grew into the Elevated pipeline"). The real order: the photo editor came first at Elevated → Dax (a spin-off) reused its Drive folders/photos for WooCommerce product pages → that WooCommerce work is what made Joshua close the loop back at Elevated (photo editor + Live Ref → Elevated WP product pages). Rewritten as its own paragraph on the Dax page; the reverse link added to `projects/photo-editor.html` ("Why it exists") and `work/photo-to-web.html` (after the Stack pills).

**Why:** plan `~/.claude/plans/jadedviber-portfolio.md` pages 5 + 5b; Joshua: "They are both products I made for Dax Distro."

**Files:** `work/rep-order-portal.html` (new), `work/rep-leads-app.html` (new), `work/img/dax-*.png` (new), `work/index.html`, `sitemap.xml`, `llms.txt`, `palette.js`, every page's `palette.js?v=`.

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
