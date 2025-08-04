// *ES6 Module Structure
// Base Controller - Shared functionality for all pages

// Refresh the page when the window gains focus
export function setupWindowFocusRefresh() {
    window.addEventListener('focus', () => {
        location.reload();
    });
}

// Time Constant - with proper element detection
export function setupYearElement() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize all base functionality
export function initializeBaseController() {
    setupWindowFocusRefresh();
    setupYearElement();
} 