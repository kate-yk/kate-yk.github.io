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


/**
 * Fetches an HTML fragment and injects it into the page.
 * @param {string} selector - CSS selector of container to fill.
 * @param {string} url      - Path to the HTML fragment.
 */
async function loadFragment(selector, url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    const html = await resp.text();
    const container = document.querySelector(selector);
    if (container) container.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}



export async function initializeBaseController() {
  // Inject common nav/footer
  await loadFragment('#nav-placeholder', '/gyco/includes/nav.html');
  await loadFragment('#footer-placeholder', '/gyco/includes/footer.html');

  // Then wire up your other behaviors
  setupWindowFocusRefresh();
  setupYearElement();
}