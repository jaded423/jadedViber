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
├── homelab.html        # Proxmox cluster + network topology
├── now.html            # current focus (/now)
├── style.css           # Dracula-themed styles
├── snek*.png           # mascot assets (snek-logo.png = OAuth/app icon; snek-app-icon.png = launcher/PWA icon — vector snek trimmed to the inner 78% of a 512 square, survives Android's circle mask; the ASCII snek is unreadable at 48 dp — used for the piGate Kuma status page 2026-09-12; snek-ascii-{hq,xl}.png = hi-res ASCII on #000 for external branding — regen recipe in docs/site-reference.md)
├── sitemap.xml · CNAME
├── app/ privacy/ terms/  # clean-path pages for Google OAuth consent (dir/index.html)
├── projects/photo-editor.html
└── docs/               # typed notes (see index)
```

OAuth/app pages, design palette, and interactive-feature details → [docs/site-reference.md](docs/site-reference.md).

## DNS Gotcha

Mac uses Twingate DNS (100.95.0.251) which can cache stale results. If DNS seems wrong:
1. Verify with `nslookup jadedviber.com 8.8.8.8`
2. Mac Wi-Fi DNS is set to Google (8.8.8.8, 8.8.4.4) to bypass router/Twingate cache
