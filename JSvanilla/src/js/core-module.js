// js/core-module.js
// Core utility functions and component implementations used by page modules.

// ============================================================================
// DOM Manipulation Utilities
// ============================================================================

/**
 * Clear the main app container or provided element.
 * @param {HTMLElement} [element] - Element to clear, defaults to 'app' or body
 * @returns {HTMLElement} The cleared container element
 * 
 * @example
 * // Clear the default app container
 * clearApp();
 * 
 * // Clear a specific container
 * const container = document.getElementById('myContainer');
 * clearApp(container);
 * 
 * // Use the returned element for chaining
 * clearApp().classList.add('cleared');
 */
export function clearApp(element) {
  const app = element || document.getElementById('app') || document.body;
  app.innerHTML = '';
  return app;
}

/**
 * Create and append a heading (h1) to app (or provided parent).
 * @param {string} text - The heading text content
 * @param {HTMLElement} [parent] - Parent container, defaults to 'app' or body
 * @returns {HTMLHeadingElement} The created heading element
 * 
 * @example
 * // Create heading in default app container
 * renderHeading('Welcome to My App');
 * 
 * // Create heading in specific container
 * const sidebar = document.getElementById('sidebar');
 * renderHeading('Navigation', sidebar);
 * 
 * // Style the returned heading element
 * const h1 = renderHeading('Dynamic Title');
 * h1.style.color = 'blue';
 * h1.classList.add('main-title');
 */
export function renderHeading(text, parent) {
  const container = parent || document.getElementById('app') || document.body;
  const h1 = document.createElement('h1');
  h1.textContent = text;
  container.appendChild(h1);
  return h1;
}

/**
 * Create and append a paragraph (p) to app (or provided parent).
 * @param {string} text - The paragraph text content
 * @param {HTMLElement} [parent] - Parent container, defaults to 'app' or body
 * @returns {HTMLParagraphElement} The created paragraph element
 * 
 * @example
 * // Create paragraph in default app container
 * renderParagraph('This is some content for the page.');
 * 
 * // Create paragraph in specific container
 * const contentArea = document.getElementById('content');
 * renderParagraph('This content goes in the content area.', contentArea);
 * 
 * // Style the returned paragraph element
 * const p = renderParagraph('Important notice');
 * p.style.fontWeight = 'bold';
 * p.classList.add('notice');
 */
export function renderParagraph(text, parent) {
  const container = parent || document.getElementById('app') || document.body;
  const p = document.createElement('p');
  p.textContent = text;
  container.appendChild(p);
  return p;
}

// ============================================================================
// Document Utilities
// ============================================================================

/**
 * Set the document title.
 * @param {string} title - The new document title
 * 
 * @example
 * // Set a simple title
 * setTitle('My Website');
 * 
 * // Set a dynamic title
 * const userName = 'John';
 * setTitle(`Welcome ${userName} - My Website`);
 * 
 * // Set title based on current page
 * const currentPage = 'about';
 * setTitle(`${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} - My Website`);
 */
export function setTitle(title) {
  if (typeof title === 'string') document.title = title;
}

// ============================================================================
// Component Functions
// ============================================================================

/**
 * Fetches an HTML fragment and injects it into the page.
 * @param {string} selector - CSS selector of container to fill
 * @param {string} url - Path to the HTML fragment
 * @returns {Promise<void>} Promise that resolves when fragment is loaded
 * 
 * @example
 * // Load a navigation fragment
 * await loadFragment('#nav-container', './fragments/navigation.html');
 * 
 * // Load content into main area
 * await loadFragment('#main-content', './fragments/article-content.html');
 * 
 * // Handle loading with error handling
 * try {
 *   await loadFragment('#sidebar', './fragments/sidebar.html');
 *   console.log('Sidebar loaded successfully');
 * } catch (error) {
 *   console.error('Failed to load sidebar:', error);
 * }
 * 
 * // Load multiple fragments
 * await Promise.all([
 *   loadFragment('#header', './fragments/header.html'),
 *   loadFragment('#footer', './fragments/footer.html')
 * ]);
 */
export async function loadFragment(selector, url) {
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
    console.error('Fragment loading error:', err);
  }
}

/**
 * Setup window focus refresh functionality.
 * Refreshes the page when the window gains focus.
 * @returns {void}
 * 
 * @example
 * // Basic usage - refresh on focus
 * setupWindowFocusRefresh();
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   // Setup other page functionality
 *   renderHeading('Welcome');
 *   
 *   // Enable auto-refresh on focus
 *   setupWindowFocusRefresh();
 * }
 * 
 * // Note: This will reload the entire page when window gains focus
 * // Use sparingly and inform users about this behavior
 */
export function setupWindowFocusRefresh() {
  window.addEventListener('focus', () => {
    location.reload();
  });
}

/**
 * Setup year element functionality.
 * Updates an element with id 'year' to display the current year.
 * @returns {void}
 * 
 * @example
 * // Basic usage - update year element
 * setupYearElement();
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   renderHeading('About Us');
 *   renderParagraph('We have been serving since 1995');
 *   
 *   // Update copyright year
 *   setupYearElement();
 * }
 * 
 * // HTML structure needed:
 * // <span id="site-year"></span> or <div id="site-year"></div>
 * 
 * // Multiple year elements can be updated by calling multiple times
 * // if you have different elements with the same ID (not recommended)
 */
export function setupYearElement() {
  const yearElement = document.getElementById('site-year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
