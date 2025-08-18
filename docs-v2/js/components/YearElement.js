// *ES6 Module Structure

/**
 * Default Export
 * 
 * Usage: 
 *   import setupWindowFocusRefresh from '../components/WindowFocusRefresh.js';
 */


function setupYearElement() {
    const yearElement = document.getElementById('year');

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

export default setupYearElement;
