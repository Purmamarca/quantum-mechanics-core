import pytest
from playwright.sync_api import sync_playwright
import os
import json

# Path to the HTML file
html_file_path = os.path.join(os.path.dirname(__file__), '..', 'index.html')

def run_js_function_in_browser(function_name, *args):
    """
    Executes a JavaScript function from the script.js file in a browser context
    using Playwright and returns the result.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(f"file://{os.path.abspath(html_file_path)}")
        # The script.js file is loaded by the HTML, so the functions are available in the global scope
        result = page.evaluate(f"{function_name}({', '.join(map(str, args))})")
        browser.close()
        return result

def test_calculate_annual_energy():
    assert run_js_function_in_browser('calculateAnnualEnergy', 5, 5, 85) == 5 * 5 * 365 * 0.85
    assert run_js_function_in_browser('calculateAnnualEnergy', 0, 5, 85) == 0
    assert run_js_function_in_browser('calculateAnnualEnergy', 10, 6, 100) == 10 * 6 * 365

def test_calculate_annual_savings():
    assert run_js_function_in_browser('calculateAnnualSavings', 5000, 0.12) == 600.0
    assert run_js_function_in_browser('calculateAnnualSavings', 0, 0.12) == 0

def test_calculate_payback_period():
    assert abs(run_js_function_in_browser('calculatePaybackPeriod', 15000, 2000) - 7.5) < 1e-9
    assert run_js_function_in_browser('calculatePaybackPeriod', 15000, 0) is None

def test_calculate_lifetime_savings():
    assert run_js_function_in_browser('calculateLifetimeSavings', 2000) < 50000
    assert run_js_function_in_browser('calculateLifetimeSavings', 0) == 0

def test_calculate_co2_reduction():
    annual_energy = 6000
    expected_co2 = (annual_energy * 0.92) / 2204.62
    assert abs(run_js_function_in_browser('calculateCO2Reduction', annual_energy) - expected_co2) < 1e-9

def test_calculate_trees_equivalent():
    co2_tons = 2.5
    expected_trees = round((co2_tons * 2204.62) / 48)
    assert run_js_function_in_browser('calculateTreesEquivalent', co2_tons) == expected_trees

def test_calculate_roi():
    assert abs(run_js_function_in_browser('calculateROI', 50000, 15000) - ((50000 - 15000) / 15000) * 100) < 1e-9
    assert run_js_function_in_browser('calculateROI', 15000, 15000) == 0
    assert run_js_function_in_browser('calculateROI', 50000, 0) is None
