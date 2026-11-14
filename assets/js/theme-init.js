/* ORIVANTA — pre-paint init. Load synchronously in <head> BEFORE the stylesheet
   to apply saved theme + direction without flicker. Keep this file tiny. */
(function () {
  var d = document.documentElement, t = null, r = null;
  try { t = localStorage.getItem("orivanta-theme"); r = localStorage.getItem("orivanta-dir"); } catch (e) {}
  if (t !== "light" && t !== "dark") {
    t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  d.setAttribute("data-theme", t);
  d.setAttribute("dir", r === "rtl" ? "rtl" : "ltr");
  d.classList.add("js");
  // Safety net: if the module bundle fails, never leave reveal content hidden.
  setTimeout(function () { if (!window.__orivantaReady) d.classList.add("reveal-fallback"); }, 2500);
})();
