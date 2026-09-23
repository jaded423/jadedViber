"""Regenerate the Turing tribute portrait. Run with ~/.venvs/elevated/bin/python (needs Pillow); paste
portrait-colour.html into turing.js PORTRAIT (JSON-escaped). Renders two ways for a dark page: A = thin (sparse glyphs, contrast-stretched),
B = colour (same glyphs, luminance-tinted in the site palette). Writes HTML fragments + a preview page."""
import sys, pathlib, html
from PIL import Image, ImageOps, ImageFilter

SRC = pathlib.Path.home() / "projects/jadedViber/turing.jpg"
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path("/tmp")
COLS = 64
CELL_ASPECT = 0.48            # glyph cell height/width ratio compensation

im = Image.open(SRC).convert("L")
w, h = im.size
im = im.crop((int(w * 0.10), int(h * 0.02), int(w * 0.90), int(h * 0.66)))   # head + shoulders, drop the coat
im = im.filter(ImageFilter.UnsharpMask(radius=3, percent=140, threshold=2))
rows = int(COLS * (im.size[1] / im.size[0]) * CELL_ASPECT)
im = im.resize((COLS, rows), Image.LANCZOS)
im = ImageOps.autocontrast(im, cutoff=2)
im = ImageOps.invert(im)     # dark page: hair, eyes and shadows become the glyphs, the paper background goes blank

px = list(im.getdata())

FLOOR = 0.32
def lum(v, gamma):
    l = v / 255.0
    l = 0.0 if l < FLOOR else (l - FLOOR) / (1 - FLOOR)   # paper texture -> blank
    return l ** gamma

# dark background -> blank; the face carries the image. Ramp goes sparse -> dense.
RAMP = " .:-=+*#%@"

def glyph(l):
    i = min(len(RAMP) - 1, int(l * len(RAMP)))
    return RAMP[i]

# ---- A: thin — hard gamma, top of ramp only for real highlights
def render_thin():
    lines = []
    for r in range(rows):
        line = "".join(glyph(lum(px[r * COLS + c], 1.5)) for c in range(COLS))
        lines.append(line.rstrip())
    return "\n".join(lines)

# ---- B: colour — softer gamma, tone buckets mapped to the palette
TONES = [  # (upper bound of luminance, css class)
    (0.18, "t0"), (0.34, "t1"), (0.52, "t2"), (0.74, "t3"), (1.01, "t4"),
]
def render_colour():
    out = []
    for r in range(rows):
        run_cls, run = None, []
        for c in range(COLS):
            l = lum(px[r * COLS + c], 1.15)
            cls = next(k for ub, k in TONES if l < ub)
            ch = glyph(l)
            if cls != run_cls:
                if run: out.append(f'<span class="{run_cls}">{html.escape("".join(run))}</span>')
                run_cls, run = cls, []
            run.append(ch)
        if run: out.append(f'<span class="{run_cls}">{html.escape("".join(run))}</span>')
        out.append("\n")
    return "".join(out)

thin = render_thin()
colour = render_colour()
(OUT / "portrait-thin.txt").write_text(thin)
(OUT / "portrait-colour.html").write_text(colour)

CSS = """
body{margin:0;background:#0a0a0a;color:#f8f8f2;font-family:'JetBrains Mono','Fira Code',Menlo,Consolas,monospace}
.row{display:flex;gap:4rem;justify-content:center;align-items:flex-start;padding:2rem}
.col{display:flex;flex-direction:column;align-items:center;gap:.8rem}
.lbl{color:#6272a4;font-size:.8rem;letter-spacing:.3em;text-transform:uppercase}
pre{margin:0;font-size:9.5px;line-height:1.05;letter-spacing:.02em;white-space:pre;color:#b9c0d8;text-shadow:0 0 12px rgba(139,233,253,.12)}
pre.colour .t0{color:#1b2028}.t1{color:#3b4a63}.t2{color:#6272a4}.t3{color:#8be9fd}.t4{color:#f8f8f2;text-shadow:0 0 8px rgba(139,233,253,.35)}
"""
(OUT / "preview.html").write_text(f"""<!doctype html><meta charset=utf-8><style>{CSS}</style>
<div class=row>
<div class=col><div class=lbl>A · thin</div><pre>{html.escape(thin)}</pre></div>
<div class=col><div class=lbl>B · colour</div><pre class=colour>{colour}</pre></div>
</div>""")
print(f"rows={rows} cols={COLS} thin={len(thin)} colour={len(colour)} bytes")
