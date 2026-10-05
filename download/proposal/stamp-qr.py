#!/usr/bin/env python3
"""
Strip the QR tile + lab email from BOTH one-pager proposal HTMLs (EN + AR).

Round-12 change (user request): the site ships with ZERO email addresses and
ZERO contact data. The scan-to-email QR (previously stamped here in mailto
mode) and the displayed lab email were removed from the proposal one-pagers.

This script is now a STRIP-ONLY utility: it removes any previously stamped
QR-TILE block and any lab-email display line. Run it after re-generating the
HTMLs (e.g. via build-ar-onepager.py) to guarantee they stay contact-free.

After stripping, re-render the PDFs:
    node skills/pdf/scripts/html2poster.js download/proposal/quantum-lab-one-pager.html    --output public/proposal/quantum-lab-one-pager.pdf    --width 794px
    node skills/pdf/scripts/html2poster.js download/proposal/quantum-lab-one-pager-ar.html --output public/proposal/quantum-lab-one-pager-ar.pdf --width 794px

If a QR is ever wanted again, encode the PUBLIC SITE URL only (never a
mailto:) via QRL_SITE_URL — contact data stays out of print assets.
"""
import re
from pathlib import Path

ROOT = Path("/home/z/my-project")
FILES = {
    "en": ROOT / "download/proposal/quantum-lab-one-pager.html",
    "ar": ROOT / "download/proposal/quantum-lab-one-pager-ar.html",
}

QR_BLOCK = re.compile(r"[ \t]*<!-- QR-TILE.*?<!-- /QR-TILE -->\n", re.S)
QR_CSS = re.compile(r"[ \t]*/\* == QR-TILE CSS.*?== QR-TILE CSS END == \*/\n", re.S)
EMAIL_LINE = re.compile(r"[ \t]*<span class=\"mail\">[^<]*@[^<]*</span><br>\n")
MAILTO_ATTR = re.compile(r"\saria-label=\"mailto:[^\"]*\"")


def strip(path: Path) -> None:
    src = path.read_text()
    src, n_block = QR_BLOCK.subn("", src)
    src, n_css = QR_CSS.subn("", src)
    src, n_mail = EMAIL_LINE.subn("", src)
    src, n_attr = MAILTO_ATTR.subn("", src)
    assert "mailto:" not in src and "university.edu.eg" not in src, f"{path} still has contact data"
    path.write_text(src)
    print(f"{path.name}: qr-block={n_block} qr-css={n_css} email={n_mail} mailto-attr={n_attr}")


if __name__ == "__main__":
    for f in FILES.values():
        strip(f)
    print("contact-free ✓ — re-render the PDFs next (see docstring)")
