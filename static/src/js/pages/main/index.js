import setupWindowFocusRefresh from '../../components/WindowFocusRefresh.js';
import setupYearElement from '../../components/YearElement.js';
import loadFragment from '../../components/FragmentLoader.js';

async function initializeController() {
    // Inject common nav/footer
    await loadFragment('#nav-placeholder', '/nav.html');
    await loadFragment('#footer-placeholder', '/footer.html');

    // Then wire up other behaviors
    setupWindowFocusRefresh();
    setupYearElement();
}


export default initializeController;

// // Wait until DOM is fully loaded
// document.addEventListener('DOMContentLoaded', async () => {
//     await initializeController();
// });