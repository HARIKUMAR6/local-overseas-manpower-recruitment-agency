/** Safe localStorage wrapper (private mode / blocked storage never throws). */
export const KEYS = Object.freeze({ theme: "orivanta-theme", dir: "orivanta-dir" });

export const store = {
  get(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
  },
};

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
