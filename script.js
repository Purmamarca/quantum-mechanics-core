/**
 * @file script.js
 * @description Clean Energy Calculator - Solar ROI and Energy Production Estimator
 * Calculates annual energy production, savings, payback period, and environmental impact
 * for solar panel systems.
 * 
 * @module CleanEnergyCalculator
 */

// ===================================
// Application State
// ===================================
const state = {
    systemSize: 5.0,        // kW
    sunHours: 5.0,          // hours/day
    panelEfficiency: 85,    // percentage
    energyCost: 0.12,       // $/kWh
    systemCost: 15000,      // $
    results: null
};

// ===================================
// DOM Elements
// ===================================
const elements = {
    // Input sliders
    systemSize: document.getElementById('system-size'),
    sunHours: document.getElementById('sun-hours'),
    panelEfficiency: document.getElementById('panel-efficiency'),
    energyCost: document.getElementById('energy-cost'),
    systemCost: document.getElementById('system-cost'),
    
    // Value displays
    systemSizeValue: document.getElementById('system-size-value'),
    sunHoursValue: document.getElementById('sun-hours-value'),
    panelEfficiencyValue: document.getElementById('panel-efficiency-value'),
    energyCostValue: document.getElementById('energy-cost-value'),
    systemCostValue: document.getElementById('system-cost-value'),
    
    // Form and buttons
    form: document.getElementById('solar-calculator-form'),
    calculateBtn: document.getElementById('calculate-btn'),
    resetBtn: document.getElementById('reset-btn'),
    
    // Results sections
    welcomeMessage: document.getElementById('welcome-message'),
    resultsCards: document.getElementById('results-cards'),
    detailedBreakdown: document.getElementById('detailed-breakdown'),
    statusBadge: document.getElementById('status-badge'),
    
    // Result values
    annualEnergy: document.getElementById('annual-energy'),
    dailyEnergy: document.getElementById('daily-energy'),
    annualSavings: document.getElementById('annual-savings'),
    monthlySavings: document.getElementById('monthly-savings'),
    paybackPeriod: document.getElementById('payback-period'),
    lifetimeSavings: document.getElementById('lifetime-savings'),
    netProfit: document.getElementById('net-profit'),
    co2Reduction: document.getElementById('co2-reduction'),
    treesPlanted: document.getElementById('trees-planted'),
    roiPercentage: document.getElementById('roi-percentage'),
    annualRoi: document.getElementById('annual-roi'),
    
    // Breakdown values
    breakdownCapacity: document.getElementById('breakdown-capacity'),
    breakdownDaily: document.getElementById('breakdown-daily'),
    breakdownMonthly: document.getElementById('breakdown-monthly'),
    breakdownEfficiency: document.getElementById('breakdown-efficiency'),
    breakdownRate: document.getElementById('breakdown-rate'),
    breakdownInvestment: document.getElementById('breakdown-investment')
};

// ===================================
// Utility Functions
// ===================================

/**
 * Formats a number as currency
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * Formats a number with commas
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

// ===================================
// Calculation Functions
// ===================================

/**
 * Calculates annual energy production
 * Formula: Energy (kWh/year) = System Size * Sun Hours * 365 * Efficiency Factor
 * 
 * @param {number} systemSize - System size in kW
 * @param {number} sunHours - Average sun hours per day
 * @param {number} efficiency - Panel efficiency percentage
 * @returns {number} Annual energy production in kWh
 */
function calculateAnnualEnergy(systemSize, sunHours, efficiency) {
    const efficiencyFactor = efficiency / 100;
    return systemSize * sunHours * 365 * efficiencyFactor;
}

/**
 * Calculates annual savings based on energy production and cost
 * 
 * @param {number} annualEnergy - Annual energy production in kWh
 * @param {number} energyCost - Cost per kWh in dollars
 * @returns {number} Annual savings in dollars
 */
function calculateAnnualSavings(annualEnergy, energyCost) {
    return annualEnergy * energyCost;
}

/**
 * Calculates payback period
 * 
 * @param {number} systemCost - Total system cost in dollars
 * @param {number} annualSavings - Annual savings in dollars
 * @returns {number} Payback period in years
 */
function calculatePaybackPeriod(systemCost, annualSavings) {
    if (annualSavings === 0) return 0;
    return systemCost / annualSavings;
}

/**
 * Calculates lifetime savings (25 years)
 * Assumes 0.5% annual degradation in panel efficiency
 * 
 * @param {number} annualSavings - First year annual savings
 * @returns {number} Total savings over 25 years
 */
function calculateLifetimeSavings(annualSavings) {
    let totalSavings = 0;
    const degradationRate = 0.005; // 0.5% per year
    
    for (let year = 0; year < 25; year++) {
        const yearSavings = annualSavings * Math.pow(1 - degradationRate, year);
        totalSavings += yearSavings;
    }
    
    return totalSavings;
}

/**
 * Calculates CO2 reduction
 * Average: 0.92 lbs CO2 per kWh (EPA estimate)
 * 
 * @param {number} annualEnergy - Annual energy production in kWh
 * @returns {number} CO2 reduction in tons per year
 */
function calculateCO2Reduction(annualEnergy) {
    const lbsPerKwh = 0.92;
    const lbsPerYear = annualEnergy * lbsPerKwh;
    return lbsPerYear / 2204.62; // Convert lbs to metric tons
}

/**
 * Calculates equivalent trees planted
 * One tree absorbs approximately 48 lbs of CO2 per year
 * 
 * @param {number} co2Tons - CO2 reduction in tons
 * @returns {number} Equivalent number of trees
 */
function calculateTreesEquivalent(co2Tons) {
    const lbsPerTree = 48;
    const co2Lbs = co2Tons * 2204.62;
    return Math.round(co2Lbs / lbsPerTree);
}

/**
 * Calculates ROI percentage
 * 
 * @param {number} lifetimeSavings - Total savings over lifetime
 * @param {number} systemCost - Initial system cost
 * @returns {number} ROI percentage
 */
function calculateROI(lifetimeSavings, systemCost) {
    if (systemCost === 0) return 0;
    return ((lifetimeSavings - systemCost) / systemCost) * 100;
}

/**
 * Main calculation function
 * Performs all calculations and returns results object
 * 
 * @returns {Object} Results object with all calculated values
 */
function performCalculations() {
    const annualEnergy = calculateAnnualEnergy(
        state.systemSize,
        state.sunHours,
        state.panelEfficiency
    );
    
    const dailyEnergy = annualEnergy / 365;
    const monthlyEnergy = annualEnergy / 12;
    
    const annualSavings = calculateAnnualSavings(annualEnergy, state.energyCost);
    const monthlySavings = annualSavings / 12;
    
    const paybackPeriod = calculatePaybackPeriod(state.systemCost, annualSavings);
    
    const lifetimeSavings = calculateLifetimeSavings(annualSavings);
    const netProfit = lifetimeSavings - state.systemCost;
    
    const co2Reduction = calculateCO2Reduction(annualEnergy);
    const treesPlanted = calculateTreesEquivalent(co2Reduction);
    
    const roiPercentage = calculateROI(lifetimeSavings, state.systemCost);
    const annualRoi = roiPercentage / 25;
    
    return {
        annualEnergy,
        dailyEnergy,
        monthlyEnergy,
        annualSavings,
        monthlySavings,
        paybackPeriod,
        lifetimeSavings,
        netProfit,
        co2Reduction,
        treesPlanted,
        roiPercentage,
        annualRoi
    };
}

// ===================================
// UI Update Functions
// ===================================

/**
 * Updates slider value displays
 */
function updateSliderDisplays() {
    elements.systemSizeValue.textContent = state.systemSize.toFixed(1);
    elements.sunHoursValue.textContent = state.sunHours.toFixed(1);
    elements.panelEfficiencyValue.textContent = state.panelEfficiency;
    elements.energyCostValue.textContent = `$${state.energyCost.toFixed(2)}`;
    elements.systemCostValue.textContent = formatCurrency(state.systemCost);
}

/**
 * Updates the results display with calculated values
 * 
 * @param {Object} results - Results object from performCalculations()
 */
function updateResultsDisplay(results) {
    // Update result cards
    elements.annualEnergy.textContent = formatNumber(results.annualEnergy, 0);
    elements.dailyEnergy.textContent = formatNumber(results.dailyEnergy, 1);
    
    elements.annualSavings.textContent = formatCurrency(results.annualSavings);
    elements.monthlySavings.textContent = formatCurrency(results.monthlySavings);
    
    elements.paybackPeriod.textContent = results.paybackPeriod.toFixed(1);
    
    elements.lifetimeSavings.textContent = formatCurrency(results.lifetimeSavings);
    elements.netProfit.textContent = formatCurrency(results.netProfit);
    
    elements.co2Reduction.textContent = formatNumber(results.co2Reduction, 2);
    elements.treesPlanted.textContent = formatNumber(results.treesPlanted, 0);
    
    elements.roiPercentage.textContent = `${formatNumber(results.roiPercentage, 0)}%`;
    elements.annualRoi.textContent = `${formatNumber(results.annualRoi, 1)}%`;
    
    // Update breakdown
    elements.breakdownCapacity.textContent = `${state.systemSize.toFixed(1)} kW`;
    elements.breakdownDaily.textContent = `${formatNumber(results.dailyEnergy, 1)} kWh`;
    elements.breakdownMonthly.textContent = `${formatNumber(results.monthlyEnergy, 0)} kWh`;
    elements.breakdownEfficiency.textContent = `${state.panelEfficiency}%`;
    elements.breakdownRate.textContent = `$${state.energyCost.toFixed(2)}/kWh`;
    elements.breakdownInvestment.textContent = formatCurrency(state.systemCost);
    
    // Show results, hide welcome
    elements.welcomeMessage.style.display = 'none';
    elements.resultsCards.style.display = 'grid';
    elements.detailedBreakdown.style.display = 'block';
    
    // Update status badge
    updateStatusBadge('Results Calculated');
}

/**
 * Updates the status badge
 * 
 * @param {string} text - Status text to display
 */
function updateStatusBadge(text) {
    const statusText = elements.statusBadge.querySelector('span:last-child');
    if (statusText) {
        statusText.textContent = text;
    }
}

/**
 * Resets the form to default values
 */
function resetForm() {
    state.systemSize = 5.0;
    state.sunHours = 5.0;
    state.panelEfficiency = 85;
    state.energyCost = 0.12;
    state.systemCost = 15000;
    
    elements.systemSize.value = state.systemSize;
    elements.sunHours.value = state.sunHours;
    elements.panelEfficiency.value = state.panelEfficiency;
    elements.energyCost.value = state.energyCost;
    elements.systemCost.value = state.systemCost;
    
    updateSliderDisplays();
    
    // Hide results, show welcome
    elements.welcomeMessage.style.display = 'block';
    elements.resultsCards.style.display = 'none';
    elements.detailedBreakdown.style.display = 'none';
    
    updateStatusBadge('Ready to Calculate');
}

// ===================================
// Event Handlers
// ===================================

/**
 * Handles slider input changes
 * 
 * @param {Event} event - Input event
 */
function handleSliderChange(event) {
    const id = event.target.id;
    const value = parseFloat(event.target.value);
    
    switch(id) {
        case 'system-size':
            state.systemSize = value;
            break;
        case 'sun-hours':
            state.sunHours = value;
            break;
        case 'panel-efficiency':
            state.panelEfficiency = value;
            break;
        case 'energy-cost':
            state.energyCost = value;
            break;
        case 'system-cost':
            state.systemCost = value;
            break;
    }
    
    updateSliderDisplays();
}

/**
 * Handles form submission
 * 
 * @param {Event} event - Submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Perform calculations
    state.results = performCalculations();
    
    // Update display
    updateResultsDisplay(state.results);
    
    // Add animation class
    elements.resultsCards.style.opacity = '0';
    setTimeout(() => {
        elements.resultsCards.style.opacity = '1';
    }, 50);
}

/**
 * Handles reset button click
 * 
 * @param {Event} event - Click event
 */
function handleResetClick(event) {
    event.preventDefault();
    resetForm();
}

// ===================================
// Event Listeners
// ===================================

/**
 * Initializes all event listeners
 */
function initializeEventListeners() {
    // Slider inputs
    elements.systemSize.addEventListener('input', handleSliderChange);
    elements.sunHours.addEventListener('input', handleSliderChange);
    elements.panelEfficiency.addEventListener('input', handleSliderChange);
    elements.energyCost.addEventListener('input', handleSliderChange);
    elements.systemCost.addEventListener('input', handleSliderChange);
    
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);
    
    // Reset button
    elements.resetBtn.addEventListener('click', handleResetClick);
}

// ===================================
// Initialization
// ===================================

/**
 * Initializes the application
 */
function init() {
    console.log('Gauss Clean Energy Calculator initialized');
    
    // Set initial slider displays
    updateSliderDisplays();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Set initial status
    updateStatusBadge('Ready to Calculate');
    
    console.log('Application ready');
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// Export for testing (if needed)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateAnnualEnergy,
        calculateAnnualSavings,
        calculatePaybackPeriod,
        calculateLifetimeSavings,
        calculateCO2Reduction,
        calculateTreesEquivalent,
        calculateROI,
        performCalculations
    };
}
