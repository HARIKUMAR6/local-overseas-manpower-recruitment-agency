/** LTR / RTL direction — English-only layout mirroring, persisted. */
import { KEYS, store } from "./storage.js";

const root = document.documentElement;
const current = () => (root.getAttribute("dir") === "rtl" ? "rtl" : "ltr");

function sync() {
  const dir = current();
  document.querySelectorAll("[data-dir-option]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.dirOption === dir));
  });
}

export function setDirection(dir) {
  root.setAttribute("dir", dir === "rtl" ? "rtl" : "ltr");
  store.set(KEYS.dir, current());
  sync();
  root.dispatchEvent(new CustomEvent("directionchange", { detail: { dir: current() } }));
}

export function initDirection() {
  sync();
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-dir-option]");
    if (btn && btn.dataset.dirOption !== current()) setDirection(btn.dataset.dirOption);
  });
}
