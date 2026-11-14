/**
 * Accessible tabs: <div data-tabs> with a [role=tablist] of [role=tab] buttons
 * (aria-controls → panel id) and [role=tabpanel] panels. Click, Arrow keys
 * (direction-aware), Home/End. Panels toggle via the hidden attribute.
 */
export function initTabs(root = document) {
  root.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

    const select = (i, focus = false) => {
      tabs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[n]) panels[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", (e) => {
        const rtl = document.documentElement.dir === "rtl";
        const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
        const prevKey = rtl ? "ArrowRight" : "ArrowLeft";
        let n = null;
        if (e.key === "ArrowDown" || e.key === nextKey) n = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp" || e.key === prevKey) n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = tabs.length - 1;
        if (n !== null) {
          e.preventDefault();
          select(n, true);
        }
      });
    });

    const start = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    select(start > -1 ? start : 0);
  });
}
