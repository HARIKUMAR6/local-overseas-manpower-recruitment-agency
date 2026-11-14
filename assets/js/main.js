/* ORIVANTA GLOBAL MOBILITY — application entry (ES module). */
import { renderHeader, renderFooter } from "./modules/layout.js";
import { initNavigation } from "./modules/nav.js";
import { initTheme } from "./modules/theme.js";
import { initDirection } from "./modules/direction.js";
import { initReveal } from "./modules/reveal.js";
import { initScrollTop } from "./modules/scroll-top.js";

const header = renderHeader();
renderFooter();
initNavigation(header);
initTheme();
initDirection();
initScrollTop();
initReveal();

window.__orivantaReady = true;
