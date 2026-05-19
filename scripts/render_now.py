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


def build_posts(items: list[dict], current: dict | None) -> list[dict]:
    """Augment items with synthetic terminal fields (filename, index)."""
    posts = []
    for idx, it in enumerate(items, start=1):
        posts.append({
            "filename": f"post.{idx}.md",
            "index": idx,
            "title": it["title"],
            "summary": it["summary"],
            "started": it.get("started", ""),
            "finished": it.get("finished", ""),
            "tags": it.get("tags", []),
            "links": it.get("links", []),
        })
    return posts


def render_jsonld(posts: list[dict]) -> str:
    blog_posts = []
    for p in posts:
        item = {
            "@type": "BlogPosting",
            "headline": p["title"],
            "abstract": p["summary"],
            "datePublished": p["finished"] or p["started"],
            "author": {"@type": "Person", "name": "Joshua Brown", "url": "https://github.com/jaded423"},
            "publisher": {"@id": "https://jadedviber.com/#identity"},
            "keywords": ", ".join(p["tags"]) if p["tags"] else "",
            "url": f"https://jadedviber.com/now.html#{p['filename']}",
        }
        blog_posts.append(item)
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://jadedviber.com/#website",
                "url": "https://jadedviber.com",
                "name": "JadedViber",
                "publisher": {"@id": "https://jadedviber.com/#identity"},
            },
            {
                "@type": "Person",
                "@id": "https://jadedviber.com/#identity",
                "name": "Joshua Brown",
                "url": "https://github.com/jaded423",
                "sameAs": ["https://github.com/jaded423"],
                "description": "Dracula-themed cyberpunk developer brand",
            },
            {
                "@type": "Blog",
                "@id": "https://jadedviber.com/now.html#blog",
                "url": "https://jadedviber.com/now.html",
                "name": "JadedViber build log",
                "description": "Shipped work — most recent first.",
                "publisher": {"@id": "https://jadedviber.com/#identity"},
                "blogPost": blog_posts,
            },
        ],
    }
    return f'  <script type="application/ld+json">\n{json.dumps(data, indent=2)}\n  </script>'


def render_noscript_fallback(posts: list[dict]) -> str:
    """Static cards for crawlers + JS-off users."""
    if not posts:
        return ""
    cards = []
    for p in posts:
        title = esc(p["title"])
        summary = esc(p["summary"])
        finished = esc(p["finished"])
        date_line = f"shipped {finished}" if finished else ""
        tags_html = render_tags(p["tags"])
        cards.append(f"""      <article class="now-archive-item" id="{esc(p['filename'])}">
        <div class="now-archive-meta">{date_line} · {esc(p['filename'])}</div>
        <h3 class="now-archive-title">{title}</h3>
        <p class="now-archive-summary">{summary}</p>
        {tags_html}
      </article>""")
    return f"""    <noscript>
      <div class="now-archive-list">
{chr(10).join(cards)}
      </div>
    </noscript>"""


def render_archive(items: list[dict], current: dict | None) -> str:
    posts = build_posts(items, current)
    data_payload = {
        "posts": posts,
        "current": current or None,
    }
    data_json = json.dumps(data_payload, indent=2)
    jsonld = render_jsonld(posts)
    noscript = render_noscript_fallback(posts)
    return f"""    <section class="now-archive">
      <h2 class="section-title">Archive</h2>
      <p class="now-archive-hint">Interactive terminal — try <code>help</code>, <code>ls</code>, <code>cat post.1</code>.</p>
      <div class="now-term" id="now-term">
        <div class="terminal-bar">
          <span class="terminal-dot red"></span>
          <span class="terminal-dot yellow"></span>
          <span class="terminal-dot green"></span>
          <span class="terminal-title">guest@jadedviber:~/archive</span>
        </div>
        <div class="now-term-body" id="now-term-body">
          <div class="now-term-output" id="now-term-output"></div>
          <form class="now-term-input-line" id="now-term-form" autocomplete="off">
            <span class="now-term-prompt">guest@jadedviber:~/archive$</span>
            <input class="now-term-input" id="now-term-input" type="text" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="off" aria-label="terminal input">
          </form>
        </div>
      </div>

      <script type="application/json" id="now-data">
{data_json}
      </script>
{jsonld}
{noscript}
    </section>
"""


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Now — JadedViber build log + shipped archive</title>
  <meta name="description" content="What I'm building right now plus a log of recently shipped work. Live build log from JadedViber — homelab, AI workflows, SEO tooling, neovim.">
  <link rel="canonical" href="https://jadedviber.com/now.html">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://jadedviber.com/now.html">
  <meta property="og:title" content="Now — JadedViber build log + shipped archive">
  <meta property="og:description" content="What I'm building right now plus a log of recently shipped work.">
  <meta property="og:image" content="https://jadedviber.com/og.png">
  <meta property="og:site_name" content="JadedViber">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Now — JadedViber build log + shipped archive">
  <meta name="twitter:description" content="What I'm building right now plus a log of recently shipped work.">
  <meta name="twitter:image" content="https://jadedviber.com/og.png">
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
  <script src="now-terminal.js"></script>
</body>
</html>
"""


def render(data: dict) -> str:
    current = data.get("current") or {}
    completed = data.get("completed") or []
    return PAGE_TEMPLATE.format(
        current_block=render_current(current) if current else "",
        archive_block=render_archive(completed, current),
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
