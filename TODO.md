# jadedViber TODO

Content strategy + build queue. Source of truth for what to ship next.

---

## Context: 2026-05-21 conversation (geoTracker session)

Working session with Claude in `~/projects/geoTracker/` covered SEO direction
for jadedviber.com. Decisions reached and committed:

**Shipped today:**
- jadedViber: cleared last open onpage_audit defect (`internal_links_low`).
  Added contextual prose links in philosophy section pointing to `homelab.html`
  + `now.html`. Internal links 2 → 4. Live re-audit **100/100, 0 defects**
  (was 98/100, 1 defect). Commit `81519b8`. IndexNow pinged.
- nownownow.com/p/DTGZ confirmed live (Derek Sivers' /now directory listing).
- nvimConfig README → jadedviber.com backlink confirmed already live (line 14).
- geoTracker: keyword cluster reorg — added `quick_win` (7 ultra-specific
  terms) and `aspirational` (15 broad terms) clusters. Total 49 keywords
  across 9 clusters. Commit `69d2c53` in geoTracker.
- geoTracker: `src/db.py` switched from `INSERT OR IGNORE` to upsert so
  cluster reassignments propagate.
- geoTracker baseline scrape of jadedviber.com captured 2026-05-21.

**Direction decided (this file's purpose):**

Three-tier content architecture:

| Tier | Purpose | Cadence | SEO target |
|---|---|---|---|
| `/now` | "what right now" + archive of past nows | weekly bumps | brand/freshness signal |
| `/projects/` | canonical per-project landing pages | updated as project evolves | `name_project` + niche cluster terms |
| `/blog/` | long-form articles, deep-dives | sporadic, evergreen | `quick_win` + `aspirational` terms |

No overlap between tiers — each Google query hits the right page. /now is
already shipped and great (interactive terminal archive). /projects/ and
/blog/ are new.

**Reason for the split:**
- /now = time-based (what I'm doing)
- /projects/ = entity-based (what I make)
- /blog/ = topic-based (what I think)

**Why this matters for SEO:** site has 3 pages today (index, now, homelab).
DA-0 sites with 3 pages don't rank regardless of meta perfection. Goal is
10+ canonical pages within ~1 month. Each project/blog page targets specific
keywords from geoTracker `quick_win` cluster.

**GH Pages scale answer:** no hard cap on page count. The "5-10" limit is
sites-per-account (1 user site + N project sites), not pages within a site.
Each page = own URL = own SEO entity. Cramming all posts on one page would
kill ranking (keyword cannibalization).

---

## Site architecture (target)

```
/                              ← index.html (philosophy + projects grid + stack)
/now.html                      ← keep as-is
/projects/index.html           ← archive/listing of all project pages
/projects/photo-editor.html
/projects/nvim.html
/projects/terminal.html        ← tmux + sesh stack
/projects/homelab.html         ← move from /homelab.html
/projects/gspace.html          ← later
/projects/geotracker.html      ← when public
/blog/index.html               ← archive/listing of blog posts
/blog/<slug>.html              ← posts (start when first one is drafted)
```

**Index.html update needed**: project cards currently link directly to GitHub.
Switch them to `/projects/<slug>.html`. Project pages then link OUT to GitHub
at the bottom. Keeps users on-site longer + funnels backlinks to your own
pages instead of straight to github.com.

**Stack section on homepage**: stays. Becomes a snapshot/summary; per-project
pages become the deep version.

**Open URL decisions:**
- `/projects/<slug>.html` vs `/projects/<slug>/index.html` (clean URLs without
  `.html`)? Latter is prettier but more dirs. Recommend stay consistent with
  current site (`.html` extension everywhere).
- `/blog/` vs `/posts/`? Recommend `/blog/` — more discoverable as a concept.

---

## Build queue (in order)

### 1. [ ] /projects/photo-editor.html (FIRST)

**Why first**: substantive, distinctive (Tkinter is rare on Mac), already has
working app to screenshot.

**Source material:**
- `~/projects/photoEditor/README.md` and `INSTALL.md`
- Screenshots of the app in action (bulk rotate, banner removal, transparent
  bg, webhook export)
- Architecture notes from CLAUDE.md if present

**Target keywords (from geoTracker quick_win + photo clusters):**
- `tkinter photo editor mac`
- `rembg batch photo processor`
- `bulk product photo background removal`

**Content sections:**
- Hero: what it does in one line + screenshot
- Why it exists (problem statement)
- Features (auto-rotation, banner removal, transparent backgrounds, webhook export)
- Stack (Tkinter, rembg, PyInstaller, PIL)
- Workflow walkthrough with screenshots
- Install (link to INSTALL.md)
- Link to GitHub repo
- Bottom: links back to /projects/ and / (cross-link equity)

**JSON-LD**: `SoftwareApplication` or `CreativeWork` schema + Person author
(same `@id` as index.html — `https://jadedviber.com/#identity`).

### 2. [ ] /projects/nvim.html (SECOND)

**Source material:**
- `~/projects/nvimConfig/README.md`
- Screenshots: Dracula+pitch-black theme, snek dashboard, blink.cmp in action
- Plugin list with rationale

**Target keywords:**
- `neovim colemak-dh keymap`
- `dracula theme pitch black variant`
- `neovim snek dashboard ascii`
- `blink.cmp neovim completion`
- `colemak-dh neovim langmap`

**Content sections:**
- Hero: tagline + screenshot
- Stack (Dracula, Colemak-DH, blink.cmp, lazy.nvim, Mason LSP)
- Why each plugin (decision rationale, not just list)
- The langmap section (Colemak-DH remapping is unusual + searchable)
- Snek dashboard (visual differentiator)
- Install (link to GitHub for setup)
- Link to repo

### 3. [ ] /projects/terminal.html (THIRD)

**Source material:**
- `~/projects/terminalConfig/README.md`
- Screenshots: tmux+sesh session picker, Catppuccin theme, status bar
- The "session-as-workflow" pattern

**Target keywords:**
- `sesh tmux session manager config`
- `tmux c-space prefix`
- `vim-tmux-navigator colemak`
- `tmux sesh catppuccin`

**Content sections:**
- Hero: paired-config concept, screenshot
- Why sesh (problem: tmux session names that aren't memorable)
- C-Space prefix (rationale + conflict resolution)
- Session-as-workflow pattern (one prefix routes whole homelab onto fuzzy
  picker — this is the differentiator)
- vim-tmux-navigator with Colemak remapping
- Catppuccin Mocha theme rationale
- Link to repo

### 4. [ ] /projects/index.html (archive page)

Build after at least 2-3 project pages exist. Listing page with cards linking
to each `/projects/<slug>.html`. Mirror style of index.html projects grid but
exhaustive.

### 5. [ ] Move /homelab.html → /projects/homelab.html

Add a redirect at old URL (HTML meta refresh or 301 if possible on GH Pages).
Update all internal links across site:
- index.html nav (line 64: `<a href="homelab.html">`)
- index.html philosophy-links (added 2026-05-21)
- sitemap.xml
- llms.txt

### 6. [ ] /blog/index.html + first post

Don't scaffold empty `/blog/` directory. Build only when first post is ready
to publish. Probably starts as a meta post:
- "How I built jadedviber.com with Claude Code in a weekend" — meta, targets
  `ai-driven personal website build` (quick_win), `vibe coding personal site`
  (aspirational).

**Future blog post ideas (parking lot):**
- Compilation of homelab gotchas (kernel pin / VFIO / rsyslog forwarding) —
  single post not three separate, since they're all "if-this-error-try-that"
  style fixes and don't deserve standalone pages
- Build-in-public log of geoTracker (once public)
- Why three-tier site architecture (this very decision)

---

## Per-page SEO checklist (apply to every new /projects/* and /blog/* page)

Same checklist that took jadedViber/index.html from 36 → 100 in onpage_audit:

- [ ] Unique `<title>` (50-60 chars), front-loaded with target keyword
- [ ] Unique `<meta name="description">` (140-160 chars), action-oriented
- [ ] `<link rel="canonical">` pointing to the page's own URL
- [ ] OpenGraph + Twitter Card tags (reuse og.png from site root for now,
      or generate page-specific og images later)
- [ ] JSON-LD schema appropriate to content (`SoftwareApplication` for tools,
      `Article` for blog posts), with Person author tied to
      `https://jadedviber.com/#identity`
- [ ] `<h1>` matching title intent
- [ ] At least 3 internal links (back to /, to /projects/, sideways to
      another /projects/* or related /blog/*)
- [ ] All `<img>` tags have alt text
- [ ] After deploy: `python3 ~/projects/geoTracker/src/onpage_audit.py <url>`
      and confirm score ≥ 95

Then ping IndexNow:
```bash
python3 ~/projects/geoTracker/src/indexnow_ping.py --site jadedviber
```

---

## Anti-spam guardrails (carry from geoTracker CLAUDE.md)

Google's March 2024 spam policy hits scaled AI content. Rules for every page:

1. **Human review** — no auto-publish; review every page before pushing
2. **Author bylines** — every post gets `Person` schema with real attribution
3. **Source citations** — link out to authority sources where relevant
4. **Topical clusters** — pages group by topic, not scattered (avoid
   cannibalization between similar /projects/* pages)
5. **Edit pass mandatory** — Claude drafts → human rewrites lead + adds
   firsthand experience the AI can't know

---

## Social presence (deferred, not blocking)

Brand reach beyond the site. Not a first-tier task — site needs to be the
canonical destination first — but needs to land eventually to feed traffic
back to jadedviber.com and broaden GEO discovery surface.

- [ ] **Pick the platforms.** Realistic shortlist: GitHub (already live),
  Mastodon or Bluesky (developer audience, federated, AI-friendly),
  one short-form video (YouTube or Twitch for homelab + coding sessions),
  and a writing surface (dev.to or Hashnode) that backlinks to /blog posts.
- [ ] **Consistent handle across platforms** — `jaded423` or `jadedviber`,
  pick one and lock it everywhere.
- [ ] **Single canonical link per bio** — point at jadedviber.com root,
  not /now and not GitHub. Lets the canonical tag resolve cleanly and
  funnels every social click through the brand homepage.
- [ ] **Cross-post `/now` bumps and `/blog` launches** — notification-style
  with a backlink. Never auto-publish full content (cannibalization +
  scaled-content risk). The site is the source of truth.
- [ ] **Extend Person `sameAs` JSON-LD** on the homepage to include every
  social handle. Search engines + LLMs use that to assemble the identity
  graph and surface JadedViber in entity-aware results.
- [ ] **Decide on comment signatures** — pick 2–3 long-running threads
  (HN, Reddit /r/selfhosted, /r/homelab) and add a passive sig with the
  site link. Slow-burn backlinks.

---

## Notes for next session

- Build queue is set: photoEditor → nvim → terminal → /projects/index.html →
  homelab move → /blog/. Don't reorder without good reason.
- Keyword targets per page already mapped to geoTracker clusters above.
- After each push: re-audit live URL + ping IndexNow.
- geoTracker tracks all these terms — within ~1 week of shipping each page,
  check `geoTracker/reports/<date>/movement.md` for first-rank signal.
- /now page is shipped and great. Don't touch it.

---

## Open questions / decisions

- [ ] When to convert one `/projects/*` page from rough draft → polished?
      Suggest: after all three (photoEditor, nvim, terminal) have rough
      pages live; then iterate on whichever gets first GSC impressions.
- [ ] Per-page og images? Currently all use root `/og.png`. Per-page would
      give better social previews but ~2 hr/page of work. Defer until after
      first three pages live.
- [ ] Whether to break the /now archive out into its own /blog-like
      structure later. For now: keep coupled to /now.html.
