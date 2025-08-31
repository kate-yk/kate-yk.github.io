// js/index.js
// Dynamic allocator — chooses ./controller/<pagename>.js based on the HTML file.
// All constructed paths are relative to this file and do NOT begin with '/'.

function sanitizeName(name) {
    // allow letters, numbers, dash, underscore only (Regular Expression, regex)
    return name.replace(/[^a-zA-Z0-9_-]/g, '');
}

function pageNameFromPath(pathname) {
    // e.g. pathname:
    // "" or "/" -> index
    // "index.html" -> index
    // "about.html" -> about
    // "some" -> some
    const raw = (pathname || '').split('/').pop() || '';
    if (!raw) return 'index';
    const noQuery = raw.split('?')[0].split('#')[0];
    let name = noQuery.endsWith('.html') ? noQuery.slice(0, -5) : noQuery;
    name = sanitizeName(name);
    return name || 'index';
}

document.addEventListener('DOMContentLoaded', async () => {
    const pageName = pageNameFromPath(window.location.pathname);
    const relativePagePath = `./controller/${pageName}.js`; // relative, no leading '/'
    try {
        const module = await import(relativePagePath);
        if (module && typeof module.default === 'function') {
        await module.default(); // page module handles its DOM using core-module
        } else {
        console.warn(`Page module loaded but has no default export function: ${relativePagePath}`);
        }
    } catch (err) {
        // Per your request: no 404 fallback. Just log the error.
        console.error(`Failed to load page module: ${relativePagePath}`, err);
    }
});
