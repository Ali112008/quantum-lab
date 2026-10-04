#!/usr/bin/env python3
"""
Stamp a QR tile into BOTH one-pager proposal HTMLs (EN + AR).

The QR encodes a print-safe, domain-free target by default:
    mailto:quantum.lab@university.edu.eg?subject=Funding — Quantum Research Lab
...the same destination as the on-page scan-to-email tile (round 8), so the
story stays consistent: paper, PDF and site all lead to the same inbox.

Once a production domain exists, re-run with the URL mode:
    QRL_SITE_URL=https://your-domain.eg python3 stamp-qr.py
    -> QR encodes https://your-domain.eg/#playground  (the interactive lab)

Idempotent: marked CSS + HTML blocks are replaced on every run, so this can
be re-executed after any regeneration of the HTML files (e.g. after
re-running build-ar-onepager.py).

After stamping, re-render the PDFs:
    node skills/pdf/scripts/html2poster.js download/proposal/quantum-lab-one-pager.html    --output public/proposal/quantum-lab-one-pager.pdf    --width 794px
    node skills/pdf/scripts/html2poster.js download/proposal/quantum-lab-one-pager-ar.html --output public/proposal/quantum-lab-one-pager-ar.pdf --width 794px
"""
import base64
import io
import os
import re
from pathlib import Path

import qrcode

ROOT = Path("/home/z/my-project")
FILES = {
    "en": ROOT / "download/proposal/quantum-lab-one-pager.html",
    "ar": ROOT / "download/proposal/quantum-lab-one-pager-ar.html",
}

LAB_EMAIL = "quantum.lab@university.edu.eg"
SUBJECT = "Funding — Quantum Research Lab"

# ---------------------------------------------------------------- QR payload
site_url = os.environ.get("QRL_SITE_URL", "").strip().rstrip("/")
if site_url:
    payload = f"{site_url}/#playground"
    mode = f"URL mode ({payload})"
else:
    from urllib.parse import quote
    payload = f"mailto:{LAB_EMAIL}?subject={quote(SUBJECT)}"
    mode = "mailto mode (domain-free, print-safe)"

qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=12,
    border=1,
)
qr.add_data(payload)
qr.make(fit=True)
img = qr.make_image(fill_color="#0A192F", back_color="#FFFFFF")  # navy-on-white: brand + print
buf = io.BytesIO()
img.save(buf, format="PNG")
qr_b64 = base64.b64encode(buf.getvalue()).decode()
qr_side = f"QR {img.size[0]}px"  # informational

# ---------------------------------------------------------------- CSS + HTML
CSS_BLOCK = """    /* == QR-TILE CSS (stamped by stamp-qr.py — do not hand-edit) == */
    .qr-tile { flex-shrink: 0; text-align: center; }
    .qr-tile .qr-frame {
      width: 78px; height: 78px; padding: 6px;
      background: #FFFFFF; border-radius: 9px;
      border: 1.5px solid rgba(0,217,255,0.65);
      box-shadow: 0 0 16px rgba(0,217,255,0.22);
      box-sizing: border-box;
    }
    .qr-tile img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    .qr-tile .qr-cap {
      margin-top: 5px; font-size: 8px; letter-spacing: 0.16em;
      color: var(--c-subtle); font-weight: 700;
    }
    .qr-tile .qr-cap b { color: var(--c-accent); font-weight: 800; }
"""

# caption differs per language; frame identical
CAPTIONS = {
    "en": '<div class="qr-cap"><b>SCAN</b> · FUND · CONNECT</div>',
    "ar": '<div class="qr-cap"><b>امسح</b> للتواصل · <span class="ltr">SCAN</span></div>',
}

def build_tile(lang: str) -> str:
    return (
        f'    <!-- QR-TILE (stamped by stamp-qr.py — {mode}) -->\n'
        f'    <div class="qr-tile" aria-label="{payload}">\n'
        f'      <div class="qr-frame"><img src="data:image/png;base64,{qr_b64}" alt="QR code"></div>\n'
        f'      {CAPTIONS[lang]}\n'
        f'    </div>\n'
        f'    <!-- /QR-TILE -->'
    )

for lang, path in FILES.items():
    if not path.exists():
        print(f"SKIP (missing): {path}")
        continue
    html = path.read_text(encoding="utf-8")

    # 1) CSS: replace existing stamped block or insert before the closing </style>
    if "/* == QR-TILE CSS" in html:
        html = re.sub(
            r"    /\* == QR-TILE CSS.*?== \*/.*?(?=\n  </style>|\n    /\* ---- browser preview)",
            CSS_BLOCK.rstrip("\n"),
            html,
            flags=re.S,
        )
    elif re.search(r"^</style>$", html, flags=re.M):
        html = re.sub(r"^</style>$", CSS_BLOCK + "</style>", html, count=1, flags=re.M)
    elif "</style>" in html:
        html = html.replace("</style>", CSS_BLOCK + "</style>", 1)
    else:
        raise SystemExit(f"No </style> anchor in {path}")

    # 2) HTML tile: strip ANY existing stamped tile, then re-insert as the
    #    middle child of <footer> (quote | QR | contact) — RTL mirrors automatically.
    tile = build_tile(lang)
    html = re.sub(r"[ \t]*<!-- QR-TILE.*?<!-- /QR-TILE -->\n?", "", html, flags=re.S)
    m = re.search(r"^(\s*)<div class=\"contact\">", html, flags=re.M)
    if not m:
        raise SystemExit(f"No footer contact anchor in {path}")
    indent = m.group(1)
    # re-indent the tile to the contact block's level, then inject before it
    tile_indented = tile.replace("\n    ", f"\n{indent}")
    html = html.replace(m.group(0), tile_indented + "\n" + m.group(0), 1)

    path.write_text(html, encoding="utf-8")
    print(f"STAMPED [{lang}] {path.name} ({mode}, {qr_side})")

print("NEXT: re-render PDFs with skills/pdf/scripts/html2poster.js (see header).")
