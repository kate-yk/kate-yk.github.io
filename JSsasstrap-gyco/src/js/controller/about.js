// js/pages/about.js
import * as Util from '../core-module.js';

export default function initAbout() {
  Util.setupWindowFocusRefresh();
  Util.setTitle('About — Example');
  Util.clearApp();
  Util.renderHeading('About This Site');
  Util.renderParagraph('This page was dynamically allocated by js/index.js and uses core-module helpers.');
}
