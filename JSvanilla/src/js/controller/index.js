// js/pages/index.js
// Note: path to core-module is relative from this file (pages/ -> ../)
import * as Util from '../core-module.js';

export default function initIndex() {
  Util.setupWindowFocusRefresh();
  Util.setTitle('Home — Example');
  Util.clearApp();
  Util.renderHeading('Welcome — Home Page');
  Util.renderParagraph('This content was rendered by core-module.js and invoked from pages/index.js.');

  // Load footer fragment
  Util.loadFragment('#footer', './footer.html');
  
  Util.setupYearElement();
}
