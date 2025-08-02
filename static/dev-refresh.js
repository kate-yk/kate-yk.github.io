// Development-only auto-refresh
// Only runs in development environment
(function() {
    // Check if we're in development (you can customize this check)
    const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname.includes('dev') ||
                        window.location.search.includes('dev=true');
    
    if (!isDevelopment) {
        return; // Don't run in production
    }
    
    // Add a visual indicator that auto-refresh is enabled
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ff6b6b;
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        z-index: 9999;
        font-family: monospace;
    `;
    indicator.textContent = 'DEV: Auto-refresh ON';
    document.body.appendChild(indicator);
    
    // Auto-refresh on visibility change (development only)
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible') {
            // Add a small delay to avoid immediate refresh
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    });
    
    console.log('Development auto-refresh enabled');
})(); 