#!/usr/bin/env python3
"""Render now.html from data/now.json.

Reads structured task data and writes the full now.html page. Keeps the
animated terminal widget for the current task and lists completed tasks
below it as crawlable static HTML.

Usage:
    python3 scripts/render_now.py            # render in place
    python3 scripts/render_now.py --check    # exit 1 if regen needed (CI)
"""
from __future__ import annotations

import argparse
import html
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "now.json"
OUT = ROOT / "now.html"


def esc(s: str) -> str:
    return html.escape(s or "", quote=True)


def render_tags(tags: list[str]) -> str:
    if not tags:
        return ""
    chips = "".join(f'<span class="now-tag">{esc(t)}</span>' for t in tags)
    return f'<div class="now-tags">{chips}</div>'


def render_links(links: list[dict]) -> str:
    if not links:
        return ""
    items = "".join(
        f'<a href="{esc(l["url"])}" target="_blank" rel="noopener">{esc(l["label"])}</a>'
        for l in links
    )
    return f'<div class="now-links">{items}</div>'


def render_current(c: dict) -> str:
    title = esc(c["title"])
    summary = esc(c["summary"])
    started = esc(c.get("started", ""))
    pct = int(c.get("progress_pct", 0))
    pct = max(0, min(100, pct))
    cmd = "cat /current.task"
    cmd_len = len(cmd)
    return f"""    <div class="stack-terminal now-terminal">
      <div class="terminal-bar">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">zsh</span>
      </div>
      <div class="terminal-body now-terminal-body">
        <div class="now-line" style="--delay: 0">
          <span class="now-prompt">$</span>
          <span class="now-cmd typing" style="--chars: {cmd_len}"> {esc(cmd)}</span>
        </div>
        <div class="now-line" style="--delay: 1">
          <span class="now-output now-current-title">{title}</span>
        </div>
        <div class="now-line" style="--delay: 2">
          <span class="now-comment">started {started}</span>
        </div>
        <div class="now-line now-summary-line" style="--delay: 3">
          <span class="now-output-text">{summary}</span>
        </div>
        {render_tags(c.get("tags", []))}
        {render_links(c.get("links", []))}
        <div class="now-line" style="--delay: 5">
          <div class="now-progress-container">
            <div class="now-progress-bar" style="--target-pct: {pct}%"></div>
            <span class="now-progress-text">{pct}%</span>
          </div>
        </div>
        <div class="now-line now-cursor-line" style="--delay: 6">
          <span class="now-prompt">$</span>
          <span class="now-blink-cursor"></span>
        </div>
      </div>
    </div>
"""


def render_archive(items: list[dict]) -> str:
    if not items:
        return ""
    cards = []
    for it in items:
        title = esc(it["title"])
        summary = esc(it["summary"])
        finished = esc(it.get("finished", ""))
        started = esc(it.get("started", ""))
        date_line = f"shipped {finished}" if finished else ""
        if started and finished and started != finished:
            date_line = f"shipped {finished} • started {started}"
        tags_html = render_tags(it.get("tags", []))
        cards.append(f"""      <article class="now-archive-item">
        <div class="now-archive-meta">{date_line}</div>
        <h3 class="now-archive-title">{title}</h3>
        <p class="now-archive-summary">{summary}</p>
        {tags_html}
      </article>""")
    cards_html = "\n".join(cards)
    return f"""    <section class="now-archive">
      <h2 class="section-title">Archive — shipped</h2>
      <div class="now-archive-list">
{cards_html}
      </div>
    </section>
"""


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Now — JadedViber build log</title>
  <meta name="description" content="What I'm building right now plus a log of recently shipped work. Live build log from JadedViber — homelab, AI workflows, SEO tooling, neovim.">
  <link rel="canonical" href="https://jadedviber.com/now.html">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://jadedviber.com/now.html">
  <meta property="og:title" content="Now — JadedViber build log">
  <meta property="og:description" content="What I'm building right now plus a log of recently shipped work.">
  <meta property="og:image" content="https://jadedviber.com/og.png">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="now.css">
  <link rel="icon" type="image/png" href="snek.png">
</head>
<body>

  <nav class="topnav">
    <a href="index.html#hero" class="nav-brand">JADED</a>
    <div class="nav-links">
      <a href="index.html#philosophy">Philosophy</a>
      <a href="index.html#projects">Projects</a>
      <a href="index.html#stack">Stack</a>
      <a href="homelab.html">Homelab</a>
      <a href="now.html" class="active">Now</a>
      <a href="https://github.com/jaded423" target="_blank">GitHub</a>
    </div>
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <div class="container">
    <section class="now-hero">
      <h1 class="section-title">/now</h1>
      <p class="now-subtitle">What I'm building right now</p>
    </section>

{current_block}
    <div class="now-explanation">
      <p>This is a <a href="https://nownownow.com/about" target="_blank" rel="noopener">/now page</a> — like an about page, but for what I'm focused on <em>right now</em>.</p>
      <p>Updated via a CLI on my Mac. When a task ships, it drops into the archive below.</p>
    </div>

{archive_block}
    <footer>
      <p>&copy; <span id="year"></span> jadedviber.com — last updated <span class="now-updated">{today}</span></p>
    </footer>
  </div>

  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {{
      hamburger.addEventListener('click', () => {{
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
      }});
    }}
  </script>
</body>
</html>
"""


def render(data: dict) -> str:
    current = data.get("current") or {}
    completed = data.get("completed") or []
    return PAGE_TEMPLATE.format(
        current_block=render_current(current) if current else "",
        archive_block=render_archive(completed),
        today=date.today().isoformat(),
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="Exit 1 if now.html is stale")
    args = ap.parse_args()

    data = json.loads(DATA.read_text())
    new_html = render(data)

    if args.check:
        cur = OUT.read_text() if OUT.exists() else ""
        if cur.strip() != new_html.strip():
            print("now.html is stale; run: python3 scripts/render_now.py", file=sys.stderr)
            return 1
        return 0

    OUT.write_text(new_html)
    print(f"wrote {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
