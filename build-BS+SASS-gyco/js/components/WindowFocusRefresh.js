// *ES6 Module Structure

/**
 * Default Export
 * 
 * Usage: 
 *   import setupWindowFocusRefresh from '../components/WindowFocusRefresh.js';
 */


// Refresh the page when the window gains focus
function setupWindowFocusRefresh() {
    window.addEventListener('focus', () => {
        location.reload();
    });
}

export default setupWindowFocusRefresh;
