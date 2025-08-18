// import initializeController from './pages/index.js';

// document.addEventListener('DOMContentLoaded', async () => {
//     await initializeController();
// });




const htmlPath = window.location.pathname;  // "/index.html"

let pagePath = htmlPath === '/' ? '/js/pages/index.js' : `/js/pages${htmlPath.replace('.html', '.js')}`;
// relative to this file, "/js/index.js"


// let pageName = htmlPath.substring(htmlPath.lastIndexOf('/') + 1).replace('.html', '');
// if (!pageName) pageName = 'index';

// console.log(`htmlPath: ${htmlPath}`);
// console.log(`pagePath: ${pagePath}`);
// console.log(`Loading page: ${pageName}`);
// console.log(`Loading page js: ./pages/${pageName}.js`);

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const module = await import(`${pagePath}`);
        if (module.default) {
            await module.default();
        }
    } catch (err) {
        console.error(`Failed to load JS for page: ${pagePath}`, err);
    }
});




// // src/js/main.js (single entry point for all pages)
// const htmlPath = window.location.pathname; // e.g., "/index.html" or "/about.html"
// let pageName = htmlPath.substring(htmlPath.lastIndexOf('/') + 1).replace('.html', '');

// if (!pageName) pageName = 'index'; // fallback for "/"


// console.log(`Loading page: ${pageName}`);
// console.log(`Loading page js: ./pages/${pageName}.js`);

// // dynamically import the corresponding page JS
// import(`./pages/${pageName}.js`)
//     .then(module => {
//         // optionally, if the page module exports an init function, you can call it
//         if (module.default) {
//             document.addEventListener('DOMContentLoaded', async () => {
//                 await module.default();
//             });
//         }
//     })
//     .catch(err => console.error(`Failed to load JS for page: ${pageName}`, err));
