/**
 * Navigation behaviour:
 *  - Desktop dropdowns: open on click only (never hover), close on outside
 *    click / Escape / focus leaving; Arrow keys move between items.
 *  - Mobile/tablet full-screen menu: focus trap, Escape, scroll lock,
 *    background made inert, auto-closes when resized to desktop.
 *  - Mobile accordion (Home): closed by default, opens on click.
 *  - Header "scrolled" state.
 */
const DESKTOP_MQ = window.matchMedia("(min-width: 80rem)");
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/* ---------- Desktop dropdowns ------------------------------------------ */
function initDropdowns(root) {
  const dropdowns = [...root.querySelectorAll("[data-dropdown]")];
  if (!dropdowns.length) return;

  const setOpen = (dd, open, { focusFirst = false } = {}) => {
    const trigger = dd.querySelector("[data-dropdown-trigger]");
    dd.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    if (open && focusFirst) dd.querySelector("[data-dropdown-panel] a")?.focus();
  };
  const closeAll = (except) => dropdowns.forEach((dd) => dd !== except && setOpen(dd, false));

  dropdowns.forEach((dd) => {
    const trigger = dd.querySelector("[data-dropdown-trigger]");
    const links = () => [...dd.querySelectorAll("[data-dropdown-panel] a")];

    trigger.addEventListener("click", () => {
      const open = !dd.classList.contains("is-open");
      closeAll(dd);
      setOpen(dd, open);
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        closeAll(dd);
        setOpen(dd, true, { focusFirst: true });
      }
    });

    dd.addEventListener("keydown", (e) => {
      if (e.target === trigger && e.key !== "Escape") return; // handled above
      const items = links();
      const idx = items.indexOf(document.activeElement);
      if (e.key === "Escape" && dd.classList.contains("is-open")) {
        e.preventDefault();
        setOpen(dd, false);
        trigger.focus();
      } else if (idx > -1 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        const next = e.key === "ArrowDown" ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
        items[next].focus();
      } else if (idx > -1 && (e.key === "Home" || e.key === "End")) {
        e.preventDefault();
        items[e.key === "Home" ? 0 : items.length - 1].focus();
      }
    });

    dd.addEventListener("focusout", (e) => {
      if (!dd.contains(e.relatedTarget)) setOpen(dd, false);
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown]")) closeAll();
  });
}

/* ---------- Mobile menu -------------------------------------------------- */
function initMobileMenu(header) {
  const toggle = header.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;
  let lastFocus = null;
  let inerted = [];

  const isOpen = () => menu.classList.contains("is-open");

  const setBackgroundInert = (on) => {
    if (on) {
      inerted = [...document.body.children].filter(
        (el) => el !== header && el !== menu && el.tagName !== "SCRIPT" && !el.inert
      );
      inerted.forEach((el) => (el.inert = true));
      // Within the header, only the toggle should stay reachable.
      header.querySelectorAll(".brand, .nav-desktop, .header-actions").forEach((el) => {
        el.inert = true;
        inerted.push(el);
      });
    } else {
      inerted.forEach((el) => (el.inert = false));
      inerted = [];
    }
  };

  const open = () => {
    lastFocus = document.activeElement;
    menu.inert = false;
    menu.classList.add("is-open");
    header.classList.add("is-menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.documentElement.classList.add("is-scroll-locked");
    setBackgroundInert(true);
    requestAnimationFrame(() => menu.querySelector(FOCUSABLE)?.focus({ preventScroll: true }));
  };

  const close = ({ restoreFocus = true } = {}) => {
    if (!isOpen()) return;
    menu.classList.remove("is-open");
    header.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.documentElement.classList.remove("is-scroll-locked");
    setBackgroundInert(false);
    menu.inert = true;
    if (restoreFocus) (lastFocus && document.contains(lastFocus) ? lastFocus : toggle).focus({ preventScroll: true });
  };

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));

  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    // Focus trap: toggle + visible focusables inside the menu.
    const nodes = [toggle, ...menu.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.closest("[inert]") && el.offsetParent !== null
    );
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Close when a link inside the menu is followed (incl. same-page anchors).
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a[href]")) close({ restoreFocus: false });
  });

  DESKTOP_MQ.addEventListener("change", (e) => e.matches && close({ restoreFocus: false }));

  /* Accordion (Home) — closed by default */
  menu.querySelectorAll("[data-accordion-trigger]").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      panel.classList.toggle("is-open", !expanded);
      panel.inert = expanded;
    });
  });
}

/* ---------- Header scrolled state --------------------------------------- */
function initHeaderScroll(header) {
  let ticking = false;
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

export function initNavigation(header) {
  if (!header) return;
  initDropdowns(header);
  initMobileMenu(header);
  initHeaderScroll(header);
}
