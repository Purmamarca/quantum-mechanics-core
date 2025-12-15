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
// Performance Metrics & Analytics
// ===================================
const metrics = {
    sessionStart: Date.now(),
    calculationCount: 0,
    totalCalculationTime: 0,
    sliderInteractions: 0,
    resetCount: 0,
    lastCalculationTime: 0,

    /**
     * Records a calculation event
     * @param {number} duration - Time taken for calculation in ms
     */
    recordCalculation(duration) {
        this.calculationCount++;
        this.totalCalculationTime += duration;
        this.lastCalculationTime = duration;

        // Log metrics for analytics (can be sent to analytics service)
        this.logEvent('calculation_performed', {
            duration_ms: duration,
            system_size: state.systemSize,
            sun_hours: state.sunHours,
            efficiency: state.panelEfficiency,
            energy_cost: state.energyCost,
            system_cost: state.systemCost
        });
    },

    /**
     * Records a slider interaction
     * @param {string} sliderId - ID of the slider that was changed
     */
    recordSliderInteraction(sliderId) {
        this.sliderInteractions++;
        this.logEvent('slider_interaction', { slider: sliderId });
    },

    /**
     * Records a reset event
     */
    recordReset() {
        this.resetCount++;
        this.logEvent('form_reset', {});
    },

    /**
     * Gets session duration in seconds
     * @returns {number} Session duration
     */
    getSessionDuration() {
        return Math.floor((Date.now() - this.sessionStart) / 1000);
    },

    /**
     * Gets average calculation time
     * @returns {number} Average time in ms
     */
    getAverageCalculationTime() {
        return this.calculationCount > 0
            ? this.totalCalculationTime / this.calculationCount
            : 0;
    },

    /**
     * Logs an event (can be extended to send to analytics service)
     * @param {string} eventName - Name of the event
     * @param {Object} eventData - Event data
     */
    logEvent(eventName, eventData) {
        // Console logging for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`[Analytics] ${eventName}:`, eventData);
        }

        // This is where you would send to Google Analytics, Mixpanel, etc.
        // Example: gtag('event', eventName, eventData);
        // Example: mixpanel.track(eventName, eventData);
    },

    /**
     * Gets comprehensive metrics summary
     * @returns {Object} Metrics summary
     */
    getSummary() {
        return {
            session_duration_seconds: this.getSessionDuration(),
            calculation_count: this.calculationCount,
            average_calculation_time_ms: this.getAverageCalculationTime(),
            slider_interactions: this.sliderInteractions,
            reset_count: this.resetCount,
            engagement_score: this.calculateEngagementScore()
        };
    },

    /**
     * Calculates user engagement score (0-100)
     * @returns {number} Engagement score
     */
    calculateEngagementScore() {
        const sessionMinutes = this.getSessionDuration() / 60;
        const interactionRate = (this.sliderInteractions + this.calculationCount) / Math.max(sessionMinutes, 1);
        const score = Math.min(100, Math.floor(interactionRate * 10 + this.calculationCount * 5));
        return score;
    }
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

    // Record slider interaction
    metrics.recordSliderInteraction(id);

    switch (id) {
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

    // Measure calculation performance
    const startTime = performance.now();

    // Perform calculations
    state.results = performCalculations();

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Record metrics
    metrics.recordCalculation(duration);

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

    // Record reset event
    metrics.recordReset();

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

    // Log session start
    metrics.logEvent('session_start', {
        timestamp: new Date().toISOString()
    });

    // Expose metrics to window for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.gaussMetrics = metrics;
        console.log('Metrics available at: window.gaussMetrics');
        console.log('Use window.gaussMetrics.getSummary() to view metrics');
    }

    console.log('Application ready');
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Log metrics summary when user leaves the page
window.addEventListener('beforeunload', () => {
    const summary = metrics.getSummary();
    metrics.logEvent('session_end', summary);
    console.log('Session Summary:', summary);
});

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
