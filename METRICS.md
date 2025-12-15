# Performance Metrics & Analytics

## Overview

This document describes the performance metrics and analytics tracking implemented in the Gauss Clean Energy Calculator.

## Metrics Tracked

### Session Metrics
- **Session Start Time**: Timestamp when the user loads the application
- **Session Duration**: Total time user spends on the page (in seconds)
- **Session End**: Logged when user leaves the page

### User Interaction Metrics
- **Calculation Count**: Number of times the user runs calculations
- **Slider Interactions**: Total number of slider adjustments made
- **Reset Count**: Number of times the user resets the form

### Performance Metrics
- **Calculation Time**: Time taken to perform calculations (in milliseconds)
- **Average Calculation Time**: Mean calculation time across all calculations
- **Last Calculation Time**: Most recent calculation duration

### Engagement Metrics
- **Engagement Score**: Calculated score (0-100) based on:
  - Interaction rate (interactions per minute)
  - Number of calculations performed
  - Session duration

## Accessing Metrics

### Development Mode
When running on localhost or 127.0.0.1, metrics are exposed to the browser console:

```javascript
// View current metrics summary
window.gaussMetrics.getSummary()

// Example output:
{
  session_duration_seconds: 120,
  calculation_count: 5,
  average_calculation_time_ms: 0.8,
  slider_interactions: 15,
  reset_count: 1,
  engagement_score: 45
}
```

### Console Logging
All analytics events are logged to the console in development mode:
- `[Analytics] session_start`
- `[Analytics] slider_interaction`
- `[Analytics] calculation_performed`
- `[Analytics] form_reset`
- `[Analytics] session_end`

## Integration with Analytics Services

The metrics system is designed to be easily integrated with popular analytics services:

### Google Analytics (gtag.js)
```javascript
// In metrics.logEvent(), add:
if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
}
```

### Mixpanel
```javascript
// In metrics.logEvent(), add:
if (typeof mixpanel !== 'undefined') {
    mixpanel.track(eventName, eventData);
}
```

### Custom Analytics Endpoint
```javascript
// In metrics.logEvent(), add:
fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, data: eventData })
});
```

## Metrics Data Structure

### Calculation Event
```javascript
{
  event: 'calculation_performed',
  data: {
    duration_ms: 0.8,
    system_size: 5.0,
    sun_hours: 5.0,
    efficiency: 85,
    energy_cost: 0.12,
    system_cost: 15000
  }
}
```

### Slider Interaction Event
```javascript
{
  event: 'slider_interaction',
  data: {
    slider: 'system-size'
  }
}
```

### Session Summary Event
```javascript
{
  event: 'session_end',
  data: {
    session_duration_seconds: 120,
    calculation_count: 5,
    average_calculation_time_ms: 0.8,
    slider_interactions: 15,
    reset_count: 1,
    engagement_score: 45
  }
}
```

## Performance Benchmarks

### Target Metrics
- **Calculation Time**: < 5ms (typical: ~1ms)
- **Page Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds

### Optimization Opportunities
Based on metrics collected, consider:
1. **High Calculation Time**: Optimize calculation algorithms
2. **Low Engagement Score**: Improve UI/UX
3. **High Reset Count**: Review default values
4. **Low Calculation Count**: Add more call-to-action prompts

## Privacy Considerations

- All metrics are collected client-side
- No personally identifiable information (PII) is tracked
- Session data is anonymous
- Metrics are only sent to analytics services if explicitly configured
- Users can disable tracking via browser settings

## Future Enhancements

- [ ] Add conversion tracking (if integrated with CRM)
- [ ] Track most common parameter combinations
- [ ] A/B testing framework for UI improvements
- [ ] Heatmap integration for click tracking
- [ ] Error tracking and reporting
- [ ] Performance monitoring alerts

## Testing Metrics

To test the metrics system:

1. Open the application in a browser
2. Open Developer Console (F12)
3. Interact with the calculator
4. Run `window.gaussMetrics.getSummary()` to view metrics
5. Check console for analytics event logs

## Changelog

### Version 1.0 (Current)
- Initial metrics implementation
- Session tracking
- Interaction tracking
- Performance measurement
- Engagement scoring
