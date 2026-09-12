#!/usr/bin/env python3
"""Regenerate snek-ascii-icon.png: the ASCII snek as a full-bleed, maskable app icon.

Android/Chrome shrink a home-screen icon into a ~48 px circle, so the render needs
jet black edge to edge (no margin), brightened + thickened glyphs, and the snek
inside the maskable safe zone (inner 80% circle). Run from the repo root:

    python3 scripts/snek-icon.py            # writes snek-ascii-icon.png (1024x1024, ~84 KB)

Needs ascii-image-converter (~/projects/go/bin) + Pillow. Same seed + recipe as the
nvim dashboard (-C -c -W 55); every render differs a little on purpose (the snek is a
seed, not a logo — see CLAUDE.md).
"""
import subprocess, tempfile, pathlib
from PIL import Image, ImageFilter, ImageEnhance

ROOT = pathlib.Path(__file__).resolve().parent.parent
AIC = pathlib.Path.home() / 'projects/go/bin/ascii-image-converter'
SZ, OUT, FILL, BRIGHT, THICK, WIDTH = 1400, 1024, 0.86, 2.0, 5, 55

with tempfile.TemporaryDirectory() as td:
    subprocess.run([str(AIC), str(ROOT / 'snek.png'), '-C', '-c', '-W', str(WIDTH),
                    '--only-save', '-s', td, '--save-bg', '0,0,0,100'], check=True,
                   stdout=subprocess.DEVNULL)
    art = Image.open(next(pathlib.Path(td).glob('*.png'))).convert('RGB')

art = art.crop(art.convert('L').point(lambda p: 255 if p > 40 else 0).getbbox())   # trim margins
side = int(SZ * FILL)
w, h = (side, int(side * art.height / art.width)) if art.width >= art.height else (int(side * art.width / art.height), side)
art = art.resize((w, h), Image.LANCZOS).filter(ImageFilter.MaxFilter(THICK))     # thicken strokes
art = ImageEnhance.Color(ImageEnhance.Brightness(art).enhance(BRIGHT)).enhance(1.3)
icon = Image.new('RGB', (SZ, SZ), (0, 0, 0))
icon.paste(art, ((SZ - w) // 2, (SZ - h) // 2))
out = ROOT / 'snek-ascii-icon.png'
# Ship 1024 px / 16-colour palette: ~84 KB. Kuma's status-page save goes over socket.io as a base64
# data URL and silently times out past ~100 KB (2026-09-12: 98 KB ok, 105 KB+ timed out). The
# ASCII art is ~4 Dracula hues on black, so 16 colours is visually identical to full RGB.
icon = icon.resize((OUT, OUT), Image.LANCZOS).quantize(16, dither=Image.Dither.NONE)
icon.save(out, compress_level=9)
print(f'wrote {out} ({OUT}x{OUT}, {out.stat().st_size//1024} KB)')
