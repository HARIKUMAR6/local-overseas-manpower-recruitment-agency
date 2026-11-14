/**
 * Expanding country rail + "Explore by country" finder.
 * Desktop: click or keyboard-focus a panel to expand it.
 * Mobile: horizontal snap scroller; the finder scrolls the chosen card into view.
 */
export function initCountryRail(root = document) {
  const rail = root.querySelector("[data-rail]");
  if (!rail) return;
  const items = [...rail.querySelectorAll("[data-country]")];

  const activate = (id) => {
    items.forEach((el) => {
      const on = el.dataset.country === id;
      el.classList.toggle("is-active", on);
      el.querySelector("[data-country-toggle]")?.setAttribute("aria-expanded", String(on));
    });
  };

  rail.addEventListener("click", (e) => {
    const t = e.target.closest("[data-country-toggle]");
    if (t) activate(t.closest("[data-country]").dataset.country);
  });
  rail.addEventListener("focusin", (e) => {
    const t = e.target.closest("[data-country-toggle]");
    if (t) activate(t.closest("[data-country]").dataset.country);
  });

  root.querySelectorAll("[data-country-finder]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = form.querySelector("select").value;
      if (!id) return;
      activate(id);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior = reduce ? "auto" : "smooth";
      document.getElementById("countries")?.scrollIntoView({ behavior, block: "start" });
      const target = items.find((el) => el.dataset.country === id);
      if (target && !window.matchMedia("(min-width: 64rem)").matches) {
        target.scrollIntoView({ behavior, inline: "center", block: "nearest" });
      }
    });
  });
}
