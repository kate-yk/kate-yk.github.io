// *ES6 Module Structure
// Base Controller - Shared functionality for all pages



















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















/**
 * Setup notification system for links with href="#".
 * Shows a Bootstrap toast notification when such links are clicked.
 * @returns {void}
 * 
 * @example
 * // Basic usage - setup notifications for all href="#" links
 * setupNotificationSystem();
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   renderHeading('Welcome');
 *   
 *   // Setup notification system for coming soon links
 *   setupNotificationSystem();
 * }
 * 
 * // HTML structure needed for Bootstrap toast:
 * // <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>
 * // The function will create this container if it doesn't exist
 * 
 * // Links that should show notifications need both:
 * // 1. class="link-notify" 
 * // 2. href="#"
 */
export function setupNotificationSystem() {
  console.log('setupNotificationSystem called'); // Debug log
  
  // Create notification container if it doesn't exist
  let notificationContainer = document.querySelector('.notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 350px;
    `;
    document.body.appendChild(notificationContainer);
    console.log('Created notification container'); // Debug log
  }

  // Find all links with both link-notify class and href="#"
  const comingSoonLinks = document.querySelectorAll('a.link-notify[href="#"]');
  console.log('Found coming soon links:', comingSoonLinks.length); // Debug log
  
  comingSoonLinks.forEach((link, index) => {
    console.log(`Setting up link ${index}:`, link.textContent || link.title); // Debug log
    link.addEventListener('click', function(e) {
      console.log('Link clicked:', this.textContent || this.title); // Debug log
      e.preventDefault();
      showNotification('Coming Soon', 'This feature is not available yet. Stay tuned!', 'primary');
    });
  });
}

/**
 * Show a Bootstrap toast notification.
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} [type] - The notification type ('info', 'success', 'warning', 'danger')
 * @returns {void}
 * 
 * @example
 * // Show a simple notification
 * showNotification('Success', 'Operation completed successfully');
 * 
 * // Show different types of notifications
 * showNotification('Warning', 'Please check your input', 'warning');
 * showNotification('Error', 'Something went wrong', 'danger');
 * 
 * // Show coming soon notification
 * showNotification('Coming Soon', 'This feature will be available soon!');
 */
export function showNotification(title, message, type = 'info') {
  console.log('showNotification called:', title, message, type); // Debug log
  
  // Create notification container if it doesn't exist
  let notificationContainer = document.querySelector('.notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 350px;
    `;
    document.body.appendChild(notificationContainer);
  }

  // Create unique ID for the notification
  const notificationId = 'notification-' + Date.now();
  
  // Determine colors based on type - using your custom green for primary
  let bgColor, textColor;


  // Try to get --bs-primary from the document's computed styles
  let root = document.documentElement;
  let cssPrimary = getComputedStyle(root).getPropertyValue('--bs-primary').trim();
  if (cssPrimary) {
    // If it's a valid color, use it for 'primary' type
    if (/^#[0-9a-fA-F]{3,8}$|^rgb|^hsl|^[a-zA-Z]+$/.test(cssPrimary)) {
      bgColor = cssPrimary;
    }
  }
  textColor = '#ffffff';
  
  
  console.log('Notification colors:', { bgColor, textColor, type }); // Debug log

  // Create notification HTML
  const notificationHTML = `
    <div id="${notificationId}" class="notification" style="
      background: ${bgColor};
      color: ${textColor};
      padding: 16px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 100%;
    ">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <strong style="font-size: 16px; margin: 0;">${title}</strong>
        <button onclick="document.getElementById('${notificationId}').remove()" style="
          background: none;
          border: none;
          color: ${textColor};
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        ">&times;</button>
      </div>
      <div style="font-size: 14px; margin: 0; line-height: 1.4;">${message}</div>
    </div>
  `;

  // Add notification to container
  notificationContainer.insertAdjacentHTML('beforeend', notificationHTML);
  
  // Get the notification element and animate it in
  const notificationElement = document.getElementById(notificationId);
  
  // Trigger animation
  setTimeout(() => {
    notificationElement.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (notificationElement && notificationElement.parentNode) {
      notificationElement.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notificationElement && notificationElement.parentNode) {
          notificationElement.remove();
        }
      }, 300);
    }
  }, 4000);
}









