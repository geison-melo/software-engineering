"""Fundos de papel quadriculado técnico para a apresentação (claro e escuro).

Grade fina a cada 0,25" e grade principal a cada 1", no tamanho do slide 16:9 (13,333" × 7,5").
"""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).parent / "figuras_slides"
OUT.mkdir(exist_ok=True)
DPI = 150
W, H = round(13.333 * DPI), round(7.5 * DPI)

for nome, fundo, fina, grossa in [("fundo_claro.png", "#FFFFFF", "#EEF1F4", "#DCE2E7"),
                                  ("fundo_escuro.png", "#1B1F23", "#23282D", "#2E343A")]:
    im = Image.new("RGB", (W, H), fundo)
    d = ImageDraw.Draw(im)
    passo = DPI / 4
    for k in range(0, int(W / passo) + 1):
        x = round(k * passo)
        d.line([(x, 0), (x, H)], fill=grossa if k % 4 == 0 else fina, width=1)
    for k in range(0, int(H / passo) + 1):
        y = round(k * passo)
        d.line([(0, y), (W, y)], fill=grossa if k % 4 == 0 else fina, width=1)
    im.save(OUT / nome, optimize=True)
print("fundos gerados")
