// include.js (fragment injector + Bootstrap accent sync)
// Behavior:
//  - Injects fragments for nodes with data-include (same as before).
//  - DOES NOT override CSS-defined --accent. It reads computed --accent and sets
//    --bs-primary and --bs-primary-rgb so Bootstrap controls match your --accent.
//  - No localStorage, no ?accent handling — pure sync from CSS.
// Usage:
//  - Put header.html / footer.html where your resolve rules expect.
//  - Add <div data-include="header"></div> / <div data-include="footer"></div>
//  - Include this script after page content: <script src="src/include.js"></script>

(function () {
'use strict';

// Helper: base URL where this script lives
function getScriptBase() {
    const script = document.currentScript;
    if (!script) {
    const scripts = Array.from(document.getElementsByTagName('script'));
    for (let i = scripts.length - 1; i >= 0; i--) {
        const s = scripts[i];
        if (s.src && s.src.indexOf('include.js') !== -1) {
        return s.src.replace(/\/[^\/]*$/, '/');
        }
    }
    return '/';
    }
    return script.src.replace(/\/[^\/]*$/, '/');
}

// Resolve url relative to base; handle absolute and origin-root paths
function resolveUrl(base, path) {
    try {
    if (/^(https?:)?\/\//i.test(path)) return path;
    if (path.startsWith('/')) return window.location.origin + path;
    return new URL(path, base).href;
    } catch (e) {
    console.warn('include.js resolveUrl error', e, base, path);
    return path;
    }
}

function ensureHtmlExt(path) {
    if (/\.[a-z0-9]+$/i.test(path)) return path;
    return path.replace(/\/$/, '') + '.html';
}

async function fetchAndInject(url, node) {
    try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) {
        console.warn(`include.js: failed to fetch ${url} (${res.status})`);
        node.innerHTML = `<!-- include failed: ${url} (${res.status}) -->`;
        return;
    }
    const text = await res.text();
    node.innerHTML = text;
    } catch (err) {
    console.error('include.js fetch error:', err, url);
    node.innerHTML = `<!-- include error: ${err && err.message ? err.message : String(err)} -->`;
    }
}

// Parse a hex color (#fff or #ffffff) to "r, g, b" string or return null
function hexToRgbString(hex) {
    if (!hex) return null;
    let h = String(hex).trim().replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

// Parse "rgb(...)" or "rgba(...)" and return "r, g, b" or null
function rgbStringToRgb(rgbStr) {
    if (!rgbStr) return null;
    const m = rgbStr.match(/rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})/i);
    if (!m) return null;
    return `${parseInt(m[1],10)}, ${parseInt(m[2],10)}, ${parseInt(m[3],10)}`;
}

// Read computed --accent and set Bootstrap vars accordingly
function syncBootstrapAccentFromCss() {
    let accentRaw = '';
    try {
    accentRaw = (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '').trim();
    } catch (e) {
    accentRaw = '';
    }

    // If accent is provided as hex (with or without #)
    let rgb = null;
    if (accentRaw) {
    // try rgb(...) form first
    rgb = rgbStringToRgb(accentRaw);
    if (!rgb) {
        // try hex: accept '#fff', 'fff', '#ffffff', 'ffffff'
        const hexMatch = accentRaw.match(/#?[0-9a-f]{3}([0-9a-f]{3})?$/i);
        if (hexMatch) {
        // normalize to include leading '#'
        const normalized = accentRaw.trim().replace(/['"]/g, '');
        const withHash = normalized.startsWith('#') ? normalized : ('#' + normalized);
        rgb = hexToRgbString(withHash);
        }
    }
    }

    // If we couldn't parse, do nothing (Bootstrap will use its defaults)
    if (!rgb) {
    // Optionally: if you want, you can fallback to a color here,
    // but per your request we respect whatever CSS defines and do not override.
    return;
    }

    // Set the CSS variables so Bootstrap picks them up
    document.documentElement.style.setProperty('--bs-primary', accentRaw || '');
    document.documentElement.style.setProperty('--bs-primary-rgb', rgb);
    // (also set --accent to normalized raw if you want to keep it identical)
    // document.documentElement.style.setProperty('--accent', accentRaw);
}

async function init() {
    // Sync accent first so any injected content that renders immediately will use the color
    syncBootstrapAccentFromCss();

    const base = getScriptBase();
    const nodes = document.querySelectorAll('[data-include]');
    if (!nodes.length) return;

    for (const node of nodes) {
    let val = node.getAttribute('data-include') || '';
    val = val.trim();
    if (!val) continue;

    if (!val.includes('/') && !val.includes('.')) {
        const filename = ensureHtmlExt(val);
        const url = resolveUrl(base, filename);
        await fetchAndInject(url, node);
        continue;
    }

    let candidate = val;
    if (!/\.[a-z0-9]+$/i.test(candidate)) candidate = ensureHtmlExt(candidate);
    const url = resolveUrl(base, candidate);
    await fetchAndInject(url, node);
    }

    // mark nav active if present
    try {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav .nav-link').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        if ((href === 'index.html' && (current === '' || current === 'index.html')) || href === current) {
        a.classList.add('active');
        } else {
        a.classList.remove('active');
        }
    });
    } catch (e) { /* ignore */ }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
  