import pytest
from bs4 import BeautifulSoup
import os

@pytest.fixture
def index_soup():
    with open('index.html', 'r', encoding='utf-8') as f:
        return BeautifulSoup(f, 'html.parser')

def test_page_title(index_soup):
    assert index_soup.title.string == "Quantum Gravity Control Panel | Reality Manipulation Interface"

def test_meta_description(index_soup):
    meta = index_soup.find("meta", attrs={"name": "description"})
    assert meta
    assert "quantum gravity manipulation interface" in meta["content"]

def test_critical_controls_exist(index_soup):
    # Check for critical control elements by ID
    ids_to_check = [
        "quantum-probability",
        "animation-speed",
        "rotation-intensity",
        "scale-factor",
        "delay-time",
        "time-dilation",
        "antigravity-toggle",
        "dispersal-btn",
        "activate-btn",
        "reset-btn",
        "export-btn",
        "populate-btn"
    ]
    for element_id in ids_to_check:
        assert index_soup.find(id=element_id), f"Element with id '{element_id}' not found"

def test_canvas_exists(index_soup):
    assert index_soup.find("canvas", id="quantum-canvas")

def test_external_resources_linked(index_soup):
    # Check CSS link
    css_link = index_soup.find("link", attrs={"href": "styles.css"})
    assert css_link, "styles.css not linked"

    # Check JS scripts
    scripts = [s.get("src") for s in index_soup.find_all("script") if s.get("src")]
    expected_scripts = [
        "quantum-visualizations.js",
        "gravity_hack.js",
        "script.js"
    ]
    for script in expected_scripts:
        assert script in scripts, f"{script} not linked in HTML"

def test_linked_files_exist():
    # This test verifies that the files referenced in HTML actually exist in the directory
    files_to_check = [
        "styles.css",
        "quantum-visualizations.js",
        "gravity_hack.js",
        "script.js"
    ]
    for filename in files_to_check:
        assert os.path.exists(filename), f"File {filename} referenced in HTML does not exist"

def test_no_nested_labels(index_soup):
    # This test ensures we don't regress to the invalid HTML state where a label is nested inside another label.
    # The original bug had <label class="toggle-label"> ... <label class="toggle-switch"> ... </label> </label>
    # We want to ensure that no label contains another label.
    labels = index_soup.find_all("label")
    for label in labels:
        if label.find("label"):
            pytest.fail(f"Found nested label: {label}")
