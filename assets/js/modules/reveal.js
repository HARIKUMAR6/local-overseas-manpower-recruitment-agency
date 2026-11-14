/**
 * Scroll reveal: add data-reveal (="up"|"fade"|"zoom"|"start") to any element.
 * Optional data-reveal-delay="120" (ms). Groups: data-reveal-stagger on a parent
 * staggers its [data-reveal] children automatically.
 */
import { prefersReducedMotion } from "./storage.js";

export function initReveal(scope = document) {
  scope.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    const step = Number(group.dataset.revealStagger) || 90;
    group.querySelectorAll("[data-reveal]").forEach((el, i) => {
      if (!el.dataset.revealDelay) el.style.setProperty("--reveal-delay", `${i * step}ms`);
    });
  });

  const els = [...scope.querySelectorAll("[data-reveal]:not(.is-visible)")];
  els.forEach((el) => {
    if (el.dataset.revealDelay) el.style.setProperty("--reveal-delay", `${el.dataset.revealDelay}ms`);
  });

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}
