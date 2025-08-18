// *ES6 Module Structure

/**
 * Default Export
 * 
 * Usage: 
 *   import setupWindowFocusRefresh from '../components/WindowFocusRefresh.js';
 */


/**
 * Fetches an HTML fragment and injects it into the page.
 * @param {string} selector - CSS selector of container to fill.
 * @param {string} url      - Path to the HTML fragment.
 */
async function loadFragment(selector, url) {
    try {
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error(`Failed to fetch ${url}: ${resp.status}`);
        }

        const html = await resp.text();
        const container = document.querySelector(selector);

        if (container) {
            container.innerHTML = html;
        }
    } catch (err) {
        console.error(err);
    }
}

export default loadFragment;
