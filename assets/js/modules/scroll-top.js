/** Scroll-to-top button with scroll-progress ring; appears after 480px. */
import { icons } from "./icons.js";
import { prefersReducedMotion } from "./storage.js";

const THRESHOLD = 480;

export function initScrollTop() {
  let btn = document.querySelector("[data-scroll-top]");
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("data-scroll-top", "");
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = `
      <svg class="to-top__ring" viewBox="0 0 52 52" aria-hidden="true">
        <circle class="track" cx="26" cy="26" r="24" pathLength="100"/>
        <circle class="bar" cx="26" cy="26" r="24" pathLength="100"/>
      </svg>${icons.arrowUp("to-top__arrow")}`;
    document.body.appendChild(btn);
  }

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    const visible = y > THRESHOLD;
    btn.classList.toggle("is-visible", visible);
    btn.tabIndex = visible ? 0 : -1;
    btn.setAttribute("aria-hidden", String(!visible));
    btn.style.setProperty("--progress", max > 0 ? Math.min(1, y / max).toFixed(3) : "0");
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    // Move focus to the top of the document for keyboard users.
    const target = document.getElementById("main") || document.body;
    if (target !== document.body) target.focus({ preventScroll: true });
  });

  update();
}
