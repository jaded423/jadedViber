# CLAUDE.md - jadedViber

> **Stack:** Tier-2 leaf (standalone). Parent/router: [global](~/.claude/CLAUDE.md). Leaf → no `wiki/` tree.

Personal brand website at **jadedviber.com**. Static single-page site, no build tools — pure HTML/CSS/JS.

**Detailed docs** (typed — start at the index): [docs/index.md](docs/index.md)
- [site-reference.md](docs/site-reference.md) — DNS records, OAuth/app pages, design tokens, interactive features
- [changelog.md](docs/changelog.md) — version history

## Hosting

- **Platform**: GitHub Pages (free) · **Repo**: `jaded423/jadedViber` · **Branch**: `master`
- **Domain**: `jadedviber.com` (registered on Squarespace, DNS → GitHub; nameservers are Google Domains)
- **SSL**: Let's Encrypt via GitHub, HTTPS enforced
- **Deploy**: push to master → auto-deploys
- Full DNS record list → [docs/site-reference.md](docs/site-reference.md#dns-squarespace-registration-google-domains-nameservers)

## Site structure

```
jadedViber/
├── index.html          # main page (hero, projects, stack)
├── homelab.html · homelab.css · homelab.js   # the lab page (rebuilt 2026-09-23): JS-rendered clickable map + 4 static SVG diagrams in the /work diagram style; shares work/work.css (hero, story cards, diagram frame); facts come from homeLab/wiki, no LAN/tailnet IPs on the page
├── now.html            # current focus (/now)
├── style.css           # Dracula-themed styles
├── palette.js · turing.js · turing.jpg   # `/` command palette + the Turing tribute (loaded on every content page); detail in docs/site-reference.md § Interactive features
├── snek*.png           # the snek is a SEED, not a logo — brand mark = the live ASCII render, deliberately non-uniform (never standardize; see brain `jadedviber-brand-snek-is-a-seed`). snek.png = seed · snek-logo.png = seed composited on #0a0a0a ONLY for Google's OAuth consent card (not an icon, not the brand) · snek-ascii-{hq,xl}.png = frozen ASCII renders on #000 for places that need a raster · snek-ascii-icon.png = full-bleed maskable phone/app icon (regen `scripts/snek-icon.py`) — regen recipe in docs/site-reference.md
├── sitemap.xml · CNAME
├── app/ privacy/ terms/  # clean-path pages for Google OAuth consent (dir/index.html)
├── projects/photo-editor.html
├── work/               # client-facing case studies (index = the gallery Cody sends clients; work.css shared) — plan: ~/.claude/plans/jadedviber-portfolio.md
└── docs/               # typed notes (see index)
```

OAuth/app pages, design palette, and interactive-feature details → [docs/site-reference.md](docs/site-reference.md).

## DNS Gotcha

Mac uses Twingate DNS (100.95.0.251) which can cache stale results. If DNS seems wrong:
1. Verify with `nslookup jadedviber.com 8.8.8.8`
2. Mac Wi-Fi DNS is set to Google (8.8.8.8, 8.8.4.4) to bypass router/Twingate cache
