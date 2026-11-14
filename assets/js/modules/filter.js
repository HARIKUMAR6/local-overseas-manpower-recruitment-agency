/**
 * Category chips + live search over a card grid.
 * Markup: [data-filter] > [data-filter-chip data-value], [data-filter-search],
 * [data-filter-item data-category data-text], [data-filter-count],
 * [data-filter-empty], [data-filter-reset].
 */
export function initFilter(root = document) {
  root.querySelectorAll("[data-filter]").forEach((f) => {
    const chips = [...f.querySelectorAll("[data-filter-chip]")];
    const search = f.querySelector("[data-filter-search]");
    const items = [...f.querySelectorAll("[data-filter-item]")];
    const count = f.querySelector("[data-filter-count]");
    const empty = f.querySelector("[data-filter-empty]");
    let cat = "all";

    const apply = () => {
      const q = (search?.value || "").trim().toLowerCase();
      let n = 0;
      items.forEach((it) => {
        const show = (cat === "all" || it.dataset.category === cat) && (!q || it.dataset.text.toLowerCase().includes(q));
        it.hidden = !show;
        if (show) {
          n++;
          it.classList.remove("is-shown");
          void it.offsetWidth; // restart the entrance animation
          it.classList.add("is-shown");
        }
      });
      if (count) count.textContent = `Showing ${n} of ${items.length} roles`;
      if (empty) empty.hidden = n !== 0;
    };

    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        cat = chip.dataset.value;
        chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        apply();
      })
    );
    search?.addEventListener("input", apply);
    f.querySelector("[data-filter-reset]")?.addEventListener("click", () => {
      cat = "all";
      if (search) search.value = "";
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.value === "all")));
      apply();
    });
    apply();
  });
}
