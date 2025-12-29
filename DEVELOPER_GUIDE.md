# Developer Guide - Gauss Clean Energy

## 1. Introduction

Welcome to the developer documentation for the Gauss Clean Energy Solar ROI Calculator. This guide is intended for developers who wish to contribute to the codebase, understand the internal architecture, or extend the functionality of the calculator.

## 2. Project Architecture

The application is built as a static client-side web application using:
- **HTML5**: For structure (`index.html`).
- **CSS3**: For styling (`styles.css`), utilizing CSS Grid and Flexbox for a responsive layout.
- **JavaScript (ES6+)**: For logic (`script.js`), handling state management, financial calculations, and DOM manipulation.
- **Python (Pytest)**: For end-to-end testing of the generated HTML structure and integrity.

There is no backend server or database. All calculations are performed instantly in the user's browser.

## 3. Directory Structure

```text
Gauss-Clean-Energy/
├── index.html              # Main application entry point
├── script.js               # Application logic (State, Metrics, Calculations)
├── styles.css              # Main stylesheet
├── tests/
│   └── test_index.py       # Python tests using BeautifulSoup for HTML verification
├── .jules/                 # Agent-specific configuration
├── .gitattributes          # Git configuration (including git-crypt settings)
├── METRICS.md              # Documentation for the analytics/metrics system
├── SECURITY.md             # Security policy and encryption details
└── README.md               # General user overview and usage instructions
```

## 4. Development Environment

### Prerequisites
- **Git**: For version control.
- **Python 3.x**: Required for running the test suite and a local development server.
- **Web Browser**: Chrome, Firefox, Safari, or Edge for testing the UI.

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/roanco/Gauss-Clean-Energy.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd Gauss-Clean-Energy
   ```
3. **Install Python dependencies (for testing):**
   ```bash
   pip install pytest beautifulsoup4
   ```

### Running Locally
Since this is a static site, you can use Python's built-in HTTP server to run it locally:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

## 5. Core Logic (`script.js`)

The JavaScript code is organized into distinct modules to separate concerns:

### 5.1 State Management
The application uses a reactive-style `state` object to hold current input values and calculation results.
```javascript
const state = {
    systemSize: 5.0,        // kW
    sunHours: 5.0,          // hours/day
    // ...
    results: null
};
```
While not using a framework like React, the code follows a similar pattern where data changes trigger UI updates via the `updateResultsDisplay()` function.

### 5.2 Metrics Module
A dedicated `metrics` object tracks user interaction and performance data (e.g., calculation time, slider usage). See [METRICS.md](METRICS.md) for full details on the analytics system.

### 5.3 Calculation Logic
Calculation functions are pure where possible, taking inputs and returning values.
- `calculateAnnualEnergy(systemSize, sunHours, efficiency)`
- `calculatePaybackPeriod(systemCost, annualSavings)`
- `calculateLifetimeSavings(annualSavings)`

### 5.4 DOM Interaction
- The `elements` object caches all DOM references to minimize lookups.
- `updateResultsDisplay(results)` handles rendering the calculated data to the HTML.
- `handleSliderChange(event)` acts as the controller, updating the `state` and triggering UI refreshes.

## 6. Testing Strategy

We use **Pytest** combined with **BeautifulSoup** to verify the integrity of the frontend code. This allows us to test the HTML structure without needing a full browser automation suite like Selenium or Playwright for basic checks.

### Running Tests
To run the test suite:
```bash
python3 -m pytest
```

### What is Tested?
The tests in `tests/test_index.py` verify:
- **Structure**: Presence of critical IDs (`system-size`, `annual-energy`) to ensure the JS hooks are valid.
- **SEO**: Correct Meta tags and titles.
- **Integrity**: Links to CSS/JS files are present and valid.
- **HTML Validation**: Checks for issues like nested `<label>` elements which are invalid HTML.
- **Accessibility**: Ensures inputs have associated labels.

## 7. Extending the Calculator

### Adding a New Parameter
1. **Update HTML**: Add the new slider/input in `index.html`. Ensure it has a unique `id`.
2. **Update State**: Add the default value to the `state` object in `script.js`.
3. **Update Logic**: Modify calculation functions to incorporate the new parameter.
4. **Update DOM**: Add the element to the `elements` object in `script.js` and add event listeners in `initializeEventListeners()`.
5. **Update Tests**: Add a test case in `tests/test_index.py` to ensure the new element exists.

### Adding a New Result Metric
1. **Update HTML**: Add a new result card or breakdown item in `index.html`.
2. **Update Logic**: Add a calculation function in `script.js` to derive the new metric.
3. **Update Display**: Modify `updateResultsDisplay()` in `script.js` to render the new value.

## 8. Security

Please refer to [SECURITY.md](SECURITY.md) for detailed information on handling sensitive data, `git-crypt` usage, and our security policies.

## 9. Code Style

- **HTML**: Semantic tags, 2-space indentation.
- **CSS**: BEM-like naming convention, grouped by component.
- **JavaScript**: JSDoc comments for all functions, ES6 features (const/let, arrow functions).
- **Python**: PEP 8 compliance, Google-style docstrings.

---
**Generated**: 2025-12-15
