# Changelog

All notable changes to jadedViber are documented here.

---

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
