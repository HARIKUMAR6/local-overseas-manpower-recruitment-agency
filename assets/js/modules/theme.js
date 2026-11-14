/** Light / dark theme — icon-only toggle(s), persisted, follows OS until chosen. */
import { KEYS, store, prefersReducedMotion } from "./storage.js";

const root = document.documentElement;
const current = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");

function sync() {
  const dark = current() === "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  });
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0a1a28" : "#f7f5ef");
}

export function setTheme(theme, { persist = true } = {}) {
  const apply = () => {
    root.setAttribute("data-theme", theme);
    sync();
  };
  if (persist) store.set(KEYS.theme, theme);
  // Cross-fade where supported; instant otherwise or with reduced motion.
  if (document.startViewTransition && !prefersReducedMotion()) document.startViewTransition(apply);
  else apply();
  root.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

export function initTheme() {
  sync();
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-theme-toggle]")) setTheme(current() === "dark" ? "light" : "dark");
  });
  // Follow OS changes only while the visitor has not chosen explicitly.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!store.get(KEYS.theme)) setTheme(e.matches ? "dark" : "light", { persist: false });
  });
}
