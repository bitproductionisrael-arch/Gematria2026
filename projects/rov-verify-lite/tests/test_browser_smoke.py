"""End-to-end tests for ROV Verify Lite's browser UI.
Install: pip install pytest playwright && playwright install chromium
Run: python -m pytest -q tests/test_browser_smoke.py
"""
from pathlib import Path
from shutil import which

import pytest
from playwright.sync_api import sync_playwright


APP = Path(__file__).resolve().parents[1] / "index.html"


@pytest.fixture(scope="module")
def page():
    assert APP.exists(), f"App missing at {APP}"
    with sync_playwright() as p:
        options = {"headless": True, "args": ["--no-sandbox"]}
        local_chromium = which("chromium") or which("google-chrome")
        if local_chromium:
            options["executable_path"] = local_chromium
        browser = p.chromium.launch(**options)
        current = browser.new_page()
        errors = []
        current.on("pageerror", lambda error: errors.append(str(error)))
        current.set_content(APP.read_text(encoding="utf-8"))
        yield current, errors
        browser.close()


def test_identical_demo(page):
    browser_page, errors = page
    browser_page.get_by_role("button", name="Try identical models").click()
    browser_page.locator("#outcome").get_by_text("MATCH ON TESTED CHECKS").wait_for()
    report = browser_page.evaluate("lastReport")
    assert report["result"] == "MATCH_ON_TESTED_CHECKS"
    assert len(report["rules"]) >= 6
    assert all(rule["status"] == "MATCH" for rule in report["rules"])
    assert not errors


def test_modified_demo(page):
    browser_page, errors = page
    browser_page.get_by_role("button", name="Try modified model").click()
    browser_page.locator("#outcome").get_by_text("DIFFERENCES DETECTED").wait_for()
    report = browser_page.evaluate("lastReport")
    assert report["result"] == "DIFFERENCES_DETECTED"
    failures = {rule["id"] for rule in report["rules"] if rule["status"] == "DIFFERENT"}
    assert "dimensions" in failures
    assert "full_triangle_signature" in failures
    assert not errors


def test_malformed_stl_is_rejected(page):
    browser_page, _ = page
    browser_page.locator("#approved").set_input_files({
        "name": "broken.stl", "mimeType": "model/stl", "buffer": b"not an STL"
    })
    browser_page.locator("#candidate").set_input_files({
        "name": "valid.stl", "mimeType": "model/stl", "buffer": b"solid empty\nendsolid empty\n"
    })
    browser_page.locator("#compare").click()
    browser_page.locator("#error").get_by_text("Unrecognized STL", exact=False).wait_for()
    assert not browser_page.locator("#result").is_visible()


def test_reject_unsupported_3mf(page):
    browser_page, _ = page
    browser_page.locator("#approved").set_input_files({
        "name": "model.3mf", "mimeType": "application/octet-stream", "buffer": b"PK\x03\x04"
    })
    browser_page.locator("#candidate").set_input_files({
        "name": "other.stl", "mimeType": "model/stl", "buffer": b"solid empty\nendsolid empty\n"
    })
    browser_page.locator("#compare").click()
    browser_page.locator("#error").get_by_text("only STL is supported", exact=False).wait_for()
    assert not browser_page.locator("#result").is_visible()


def test_binary_stl_parser(page):
    browser_page, _ = page
    result = browser_page.evaluate("""() => {
      const a = new ArrayBuffer(84 + 50);
      const v = new DataView(a);
      v.setUint32(80, 1, true);
      [[0,0,0],[1,0,0],[0,1,0]].forEach((p, i) => p.forEach((n,j) =>
        v.setFloat32(84 + 12 + i*12 + j*4, n, true)));
      return parseSTL(a);
    }""")
    assert result == [[[0, 0, 0], [1, 0, 0], [0, 1, 0]]]
