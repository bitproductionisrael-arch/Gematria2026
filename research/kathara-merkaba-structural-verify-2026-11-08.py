#!/usr/bin/env python3
"""RovGrid structural arithmetic for 324044.pdf (49-page image atlas).

This validates arithmetic bridges only, not the source's physiological,
electromagnetic, spiritual or physical claims. Optional --pdf checks number
of pages and the exact duplicate image on PDF pages 1 and 48.
"""
from fractions import Fraction
from pathlib import Path
import argparse

def verify_arithmetic():
    assert 4*5 == 20                 # PDF 33: Ethos flame grouping
    assert 24 + 20 == 44             # PDF 33: two distinct tallies
    assert 24 - 20 == 4
    assert 24*37 == 888             # RovGrid association
    assert 20*26 == 520             # face of 8x20x26
    assert 20*8 == 160              # face of 8x20x26
    assert 8*26 == 208
    assert 160+208+520 == 888
    assert 7+8 == 15                # PDF 15: named chakra categories
    assert 7+1+7 == 15              # PDF 46: named manifestation fields
    assert 4*3 == 12                # PDF 47: shields x signets
    assert 12*12 == 144             # PDF 16: hypothetical indexed code matrix
    assert 360//45 == 8
    assert 360//90 == 4
    assert Fraction(100,3)+Fraction(35,3)==45  # PDF 30 labels 33 1/3 and 11 2/3
    # Rotation by 45 degrees forms cyclic group of order 8 on orientations:
    assert [(n+8)%8 for n in range(8)] == list(range(8))
    print("PASS: source counts and arithmetic connections, no physical inference")

def verify_pdf(path):
    try:
        import fitz
    except ImportError:
        raise SystemExit("For PDF check install PyMuPDF: pip install pymupdf")
    document=fitz.open(path)
    assert len(document)==49, len(document)
    a=document[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False)
    b=document[47].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False)
    assert a.width == b.width and a.height == b.height and a.samples==b.samples
    assert all(len(page.get_text().strip())==0 for page in document)
    print("PASS: 49 image-only pages, PDF 1 and 48 render pixel-identically")

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--pdf",type=Path,help="Optional original 324044.pdf")
    args=parser.parse_args()
    verify_arithmetic()
    if args.pdf:
        verify_pdf(args.pdf)
