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
├── style.css           # Dracula-themed styles
├── snek.png            # Color viper mascot
├── snek-ascii.png      # ASCII art version (easter egg)
├── stack-screenshot.png # tmux setup screenshot
├── CNAME               # GitHub Pages custom domain
└── docs/
    └── changelog.md    # Version history
```

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
