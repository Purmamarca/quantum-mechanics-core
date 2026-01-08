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
    # Navigate to parent directory to find index.html
    test_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(test_dir)
    index_path = os.path.join(parent_dir, 'index.html')
    
    with open(index_path, 'r', encoding='utf-8') as f:
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
    assert index_soup.title.string == "Gauss Clean Energy | Solar ROI Calculator"

def test_meta_description(index_soup):
    """
    Verifies that the meta description exists and contains expected keywords.

    Finds the <meta name="description"> tag and checks if its 'content' attribute
    contains the phrase "solar energy estimation".

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    meta = index_soup.find("meta", attrs={"name": "description"})
    assert meta
    assert "solar energy estimation" in meta["content"]

def test_critical_controls_exist(index_soup):
    """
    Verifies that all critical control elements are present in the DOM by their IDs.

    Iterates through a list of required element IDs (sliders, buttons)
    and asserts that each one exists in the parsed HTML.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    # Check for critical control elements by ID
    ids_to_check = [
        "system-size",
        "sun-hours",
        "panel-efficiency",
        "energy-cost",
        "system-cost",
        "reset-btn"
    ]
    for element_id in ids_to_check:
        assert index_soup.find(id=element_id), f"Element with id '{element_id}' not found"

def test_result_elements_exist(index_soup):
    """
    Verifies that all result display elements are present in the DOM.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    result_ids = [
        "annual-energy",
        "daily-energy",
        "annual-savings",
        "monthly-savings",
        "payback-period",
        "lifetime-savings",
        "net-profit",
        "co2-reduction",
        "trees-planted",
        "roi-percentage",
        "annual-roi"
    ]
    for element_id in result_ids:
        assert index_soup.find(id=element_id), f"Result element with id '{element_id}' not found"

def test_external_resources_linked(index_soup):
    """
    Verifies that external CSS and JS resources are correctly linked in the HTML.

    Checks for the presence of the link to 'styles.css' and script tag pointing
    to 'script.js'.

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
    assert "script.js" in scripts, "script.js not linked in HTML"

def test_linked_files_exist():
    """
    Verifies that the files referenced in the HTML actually exist in the file system.

    Checks for the existence of 'styles.css' and 'script.js' in the parent directory.

    Returns:
        None
    """
    test_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(test_dir)
    
    files_to_check = [
        "styles.css",
        "script.js"
    ]
    for filename in files_to_check:
        file_path = os.path.join(parent_dir, filename)
        assert os.path.exists(file_path), f"File {filename} referenced in HTML does not exist"

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
    labels = index_soup.find_all("label")
    for label in labels:
        if label.find("label"):
            pytest.fail(f"Found nested label: {label}")

def test_form_structure(index_soup):
    """
    Verifies that the main form exists and has the correct ID.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    form = index_soup.find("form", id="solar-calculator-form")
    assert form, "Main calculator form not found"

def test_semantic_html(index_soup):
    """
    Verifies that semantic HTML5 elements are used appropriately.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    # Check for semantic elements
    assert index_soup.find("header"), "No <header> element found"
    assert index_soup.find("main"), "No <main> element found"
    assert index_soup.find("footer"), "No <footer> element found"
    assert index_soup.find("h1"), "No <h1> heading found"

def test_accessibility_features(index_soup):
    """
    Verifies basic accessibility features are present.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    # Check that all inputs have associated labels
    inputs = index_soup.find_all("input", type="range")
    for input_elem in inputs:
        input_id = input_elem.get("id")
        if input_id:
            label = index_soup.find("label", attrs={"for": input_id})
            assert label, f"No label found for input with id '{input_id}'"

def test_google_fonts_loaded(index_soup):
    """
    Verifies that Google Fonts are properly linked.

    Args:
        index_soup (BeautifulSoup): The parsed HTML object fixture.

    Returns:
        None
    """
    font_links = index_soup.find_all("link", href=lambda x: x and "fonts.googleapis.com" in x)
    assert len(font_links) > 0, "Google Fonts not properly linked"
