# Gauss-Motus Clean Energy

**Project Title:** Gauss-Motus Clean Energy | Reality Manipulation Interface

## Description
Gauss-Motus Clean Energy is an advanced, interactive web interface designed to simulate and manipulate "quantum gravity" effects on HTML elements. It leverages a physics engine to apply dynamic forces to the DOM, allowing users to experience and experiment with concepts like gravity, time dilation, and quantum phenomena in a web environment.

The interface serves as a "Reality Manipulation Interface," offering a playful and educational way to visualize complex physics concepts through direct interaction with web page elements.

## Technologies Used
*   **HTML5:** Structure of the control panel and demo environment.
*   **CSS:** Styling for the interface (referenced as `styles.css`).
*   **JavaScript:** Core logic for interaction and simulations (referenced as `script.js`, `gravity_hack.js`, `quantum-visualizations.js`).
*   **Matter.js:** A 2D physics engine for the web (loaded via CDN), enabling the gravity and collision effects.
*   **Python (pytest):** Used for automated testing of the HTML structure.

## Features

### Physics Control Panel
The main interface allows real-time adjustment of various physical and quantum parameters:
*   **Quantum Probability:** Adjusts the chance of text transformations.
*   **Animation Speed:** Controls the duration of the gravity effects.
*   **Rotation Intensity:** Sets the initial rotation angle for elements affected by gravity.
*   **Scale Factor:** Manipulates the size of elements when the effect is triggered.
*   **Activation Delay:** Sets a timer before the gravity effect kicks in.
*   **Time Dilation:** A control to simulate slow-motion effects, ranging from 0.5x to 5x speed.

### Gravity Modes
*   **Antigravity Mode:** A toggle to invert gravity, causing elements to float upwards instead of falling.
*   **Dispersal:** A "Activate Dispersal" button that applies an explosive radial force to scatter elements.

### Quantum Visualizations
A dedicated canvas area visualizes fundamental quantum mechanics concepts:
*   **Double Slit:** Simulation of the double-slit experiment.
*   **Particle Box:** Visualization of particles in a box.
*   **Bloch Sphere:** Representation of quantum states.
*   **Quantum Tunneling:** Visualization of the tunneling effect.

### Demo Environment
A "Live Demo Environment" is provided to test the effects immediately. It includes:
*   Cards representing "Quantum Mechanics," "General Relativity," and "String Theory."
*   Status indicators for Quantum State, Gravity, and Reality.
*   Navigation links and text content to demonstrate how the physics engine interacts with different DOM elements.

### Code Export
*   **Export Code:** A feature to export the underlying "Quantum Gravity Code," allowing users to copy and paste the effect script into the browser console of other websites to apply the effects universally.

## Setup/Usage

### Prerequisites
*   A modern web browser (Chrome, Firefox, Safari, Edge).
*   Python 3.x (for running tests).
*   `pytest` and `beautifulsoup4` python packages.

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/gauss-motus-clean-energy.git
    cd gauss-motus-clean-energy
    ```
2.  Install python dependencies (optional, for development):
    ```bash
    pip install pytest beautifulsoup4
    ```

### Running the Application
1.  Open `index.html` in your web browser.
2.  Interact with the sliders and buttons in the left-hand control panel.
3.  Click "Activate Quantum Gravity" to see the effects on the demo content.
4.  Use the right-hand panel buttons to switch between quantum visualizations.

### Running Tests
To ensure the integrity of the project structure, you can run the included test suite:

```bash
pytest
```

This will verify:
*   Page title and meta descriptions.
*   Existence of critical UI controls.
*   Proper linking of external resources (CSS, JS).
*   Validity of HTML structure (e.g., no nested labels).

## Development
*   **`index.html`**: The main structure of the page.
*   **`styles.css`**: Contains all styling rules.
*   **`script.js`**: Main entry point for application logic.
*   **`gravity_hack.js`**: Contains Matter.js physics implementation.
*   **`quantum-visualizations.js`**: Contains Canvas rendering code.

Please ensure all new functions and classes are fully documented with JSDoc (for JavaScript) or Google Style Docstrings (for Python).
