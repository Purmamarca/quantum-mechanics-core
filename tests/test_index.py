import pytest
from bs4 import BeautifulSoup
import os

@pytest.fixture
def index_soup():
    """
    Parses the index.html file into a BeautifulSoup object.

    Reads the 'index.html' file from the root directory and parses it using
    BeautifulSoup with the 'html.parser'. This fixture is used by other tests
    to inspect the HTML structure.

    Returns:
        BeautifulSoup: A parsed representation of the index.html file.
    """
    with open('index.html', 'r', encoding='utf-8') as f:
        return BeautifulSoup(f, 'html.parser')

def test_page_title(index_soup):
    """
    Verifies that the page title matches the expected string.

    Checks the <title> tag in the HTML to ensure it has the correct text.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    assert index_soup.title.string == "Quantum Gravity Control Panel | Reality Manipulation Interface"

def test_meta_description(index_soup):
    """
    Verifies that the meta description exists and contains expected keywords.

    Finds the <meta name="description"> tag and checks if its 'content' attribute
    contains the phrase "quantum gravity manipulation interface".

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    meta = index_soup.find("meta", attrs={"name": "description"})
    assert meta
    assert "quantum gravity manipulation interface" in meta["content"]

def test_critical_controls_exist(index_soup):
    """
    Verifies that all critical control elements are present in the DOM by their IDs.

    Iterates through a list of required element IDs (sliders, buttons, toggles)
    and asserts that each one exists in the parsed HTML.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
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
    """
    Verifies that the quantum visualization canvas exists.

    Checks for a <canvas> element with the ID 'quantum-canvas'.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    assert index_soup.find("canvas", id="quantum-canvas")

def test_external_resources_linked(index_soup):
    """
    Verifies that external CSS and JS resources are correctly linked in the HTML.

    Checks for the presence of the link to 'styles.css' and script tags pointing
    to 'quantum-visualizations.js', 'gravity_hack.js', and 'script.js'.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
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
    """
    Verifies that the files referenced in the HTML actually exist in the file system.

    Checks for the existence of 'styles.css', 'quantum-visualizations.js',
    'gravity_hack.js', and 'script.js' in the current directory.

    Returns:
        None
    """
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
    """
    Verifies that there are no nested <label> elements in the HTML.

    Nested labels are invalid HTML and cause issues with accessibility and event handling.
    This test iterates through all <label> elements and ensures they do not contain
    another <label> element as a descendant.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    # This test ensures we don't regress to the invalid HTML state where a label is nested inside another label.
    # The original bug had <label class="toggle-label"> ... <label class="toggle-switch"> ... </label> </label>
    # We want to ensure that no label contains another label.
    labels = index_soup.find_all("label")
    for label in labels:
        if label.find("label"):
            pytest.fail(f"Found nested label: {label}")
