// Smart content refresh - updates only specific sections
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        // Only refresh if page has been inactive for more than 5 minutes
        const lastActivity = sessionStorage.getItem('lastActivity') || Date.now();
        const timeSinceLastActivity = Date.now() - lastActivity;
        
        if (timeSinceLastActivity > 5 * 60 * 1000) { // 5 minutes
            refreshContent();
        }
        
        // Update last activity time
        sessionStorage.setItem('lastActivity', Date.now());
    }
});

function refreshContent() {
    // Update only specific content areas
    const contentAreas = document.querySelectorAll('[data-auto-refresh]');
    
    contentAreas.forEach(area => {
        const refreshUrl = area.getAttribute('data-refresh-url');
        if (refreshUrl) {
            fetch(refreshUrl)
                .then(response => response.text())
                .then(html => {
                    area.innerHTML = html;
                    console.log('Content refreshed:', area.id || area.className);
                })
                .catch(error => {
                    console.log('Refresh failed:', error);
                });
        }
    });
}

// Track user activity
document.addEventListener('click', updateActivity);
document.addEventListener('keypress', updateActivity);
document.addEventListener('scroll', updateActivity);

function updateActivity() {
    sessionStorage.setItem('lastActivity', Date.now());
} 