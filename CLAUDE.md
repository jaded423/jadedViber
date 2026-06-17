# CLAUDE.md - jadedViber

Personal brand website at **jadedviber.com**.

## Hosting

- **Platform**: GitHub Pages (free)
- **Repo**: `jaded423/jadedViber`
- **Branch**: `master`
- **Domain**: `jadedviber.com` (registered on Squarespace, DNS pointed to GitHub)
- **SSL**: Let's Encrypt via GitHub, HTTPS enforced
- **Deploy**: Push to master → auto-deploys

## DNS (Squarespace)

Nameservers are Google Domains (`ns-cloud-c1-4.googledomains.com`), not Squarespace.

Custom records:
- 4x `@` A records → GitHub Pages IPs (185.199.108-111.153)
- `www` CNAME → `jaded423.github.io`
- `_github-pages-challenge-jaded423` TXT → domain verification
- `dns` A → `192.168.68.250` (pihole, unrelated)
- `_acme-challenge.dns` TXT (pihole cert, unrelated)

**Keep**: Google Workspace MX records, Google Workspace Verification TXT

## Site Structure

Static single-page site, no build tools. Pure HTML/CSS/JS.

```
jadedViber/
├── index.html          # Main page (hero, projects, stack)
├── homelab.html        # Proxmox cluster + network topology
├── now.html            # Current focus (/now)
├── style.css           # Dracula-themed styles
├── snek.png            # Color viper mascot (transparent RGBA)
├── snek-logo.png       # 512×512 mascot on #0a0a0a — OAuth/app icon (see below)
├── snek-ascii.png      # ASCII art version (easter egg)
├── stack-screenshot.png # tmux setup screenshot
├── sitemap.xml         # includes /app, /privacy, /terms
├── CNAME               # GitHub Pages custom domain
├── app/
│   └── index.html      # → /app  (OAuth app home page, "JadedViber")
├── privacy/
│   └── index.html      # → /privacy  (privacy policy + Google limited-use)
├── terms/
│   └── index.html      # → /terms  (terms of service)
├── projects/
│   └── photo-editor.html
└── docs/
    └── changelog.md    # Version history
```

Clean paths (`/app`, `/privacy`, `/terms`) are `dir/index.html` — GitHub Pages
(no Jekyll) serves them without the `.html`. All match the Dracula theme + nav/
footer pattern from `projects/photo-editor.html`.

## OAuth / app pages (added 2026-06-17)

Built so the Google-account-automation tooling (served from other repos) has the
public-facing pages Google's OAuth consent + branding flow requires:

- **`/app`** — home page. H1 is exactly **"JadedViber"** (must match the OAuth
  consent-screen app name). Explains the app's purpose and lists the Google
  scopes it requests. This is the URL to set as the Google "Application home page".
- **`/privacy`** — privacy policy. Contains the verbatim **Google API Services
  Limited Use** disclosure (data not sold/shared/used for ads, not used to train
  models). Effective 2026-06-17, contact jaded423@gmail.com.
- **`/terms`** — terms of service.
- **`snek-logo.png`** — use this (not `snek.png`) for the OAuth logo. `snek.png`
  is transparent and renders **white** on Google's light consent card; the logo
  version is composited on the site's `#0a0a0a` background.

The tooling that consumes these pages lives in another repo and is owned by a
separate session — this repo only hosts the static pages + logo.

## Design

- **Theme**: Dracula color palette on #0a0a0a background
- **Font**: SF Mono / Fira Code / monospace stack
- **Colors**: Green (#50fa7b), Cyan (#8be9fd), Purple (#bd93f9)
- **Branding**: Snek mascot, "All vibe. No grind." tagline

## Interactive Features

- **Snek easter egg**: Click logo → scanline block transition to ASCII art → fade back
- **Stack terminal reveal**: Scroll into view → 20x20 grid blocks disappear left-to-right, row-by-row
- **Nav**: Fixed top bar with smooth scroll to sections

## DNS Gotcha

Mac uses Twingate DNS (100.95.0.251) which can cache stale results. If DNS seems wrong:
1. Check with `nslookup jadedviber.com 8.8.8.8` to verify
2. Mac Wi-Fi DNS is set to Google (8.8.8.8, 8.8.4.4) to bypass router/Twingate cache

## Changelog

See [docs/changelog.md](docs/changelog.md)
