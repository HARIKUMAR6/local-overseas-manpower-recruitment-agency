/**
 * Renders the shared header, mobile menu and footer into placeholders:
 *   <div data-site-header></div>   <div data-site-footer></div>
 * Optional: <div data-site-header data-variant="overlay"> → transparent header
 * floating over a dark hero until the page is scrolled.
 */
import { NAV, CTA, SITE } from "./site-config.js";
import { icons } from "./icons.js";
import { emblem, brandLockup } from "./brand.js";

const pad = (n) => String(n).padStart(2, "0");
const current = (page, id) => (page === id ? ' aria-current="page"' : "");

const themeToggle = () => `
  <button type="button" class="icon-btn theme-toggle" data-theme-toggle
    aria-label="Switch to dark theme" aria-pressed="false">
    ${icons.moon()}${icons.sun()}
  </button>`;

const dirToggle = () => `
  <div class="seg" role="group" aria-label="Text direction">
    <button type="button" class="seg__btn" data-dir-option="ltr" aria-pressed="true">LTR</button>
    <button type="button" class="seg__btn" data-dir-option="rtl" aria-pressed="false">RTL</button>
  </div>`;

function desktopNav(page) {
  const items = NAV.map((item) => {
    if (item.children) {
      const active = item.children.some((c) => c.id === page);
      const links = item.children
        .map(
          (c, i) => `
          <li><a class="dropdown-item" href="${c.href}"${current(page, c.id)}>
            <span class="dropdown-item__num" aria-hidden="true">${pad(i + 1)}</span>
            <span><span class="dropdown-item__title">${c.label}</span>
            <span class="dropdown-item__desc">${c.desc}</span></span>
          </a></li>`
        )
        .join("");
      return `
        <li class="nav-dropdown" data-dropdown>
          <button type="button" class="nav-link${active ? " is-active" : ""}" data-dropdown-trigger
            aria-expanded="false" aria-controls="dd-${item.id}">
            ${item.label}${icons.chevronDown("nav-link__chev")}
          </button>
          <ul class="dropdown-panel" id="dd-${item.id}" data-dropdown-panel role="list">${links}</ul>
        </li>`;
    }
    return `<li><a class="nav-link" href="${item.href}"${current(page, item.id)}>${item.label}</a></li>`;
  }).join("");
  return `<nav class="nav-desktop" aria-label="Primary"><ul class="nav-list" role="list">${items}</ul></nav>`;
}

function mobileMenu(page) {
  const items = NAV.map((item, i) => {
    const style = ` style="--i:${i}"`;
    if (item.children) {
      const links = item.children
        .map(
          (c, n) => `
          <li><a class="m-sub__link" href="${c.href}"${current(page, c.id)}>
            <span class="dropdown-item__num" aria-hidden="true">${pad(n + 1)}</span>${c.label}
          </a></li>`
        )
        .join("");
      return `
        <li class="m-nav__item"${style}>
          <button type="button" class="m-nav__link" data-accordion-trigger aria-expanded="false" aria-controls="m-sub-${item.id}">
            ${item.label}${icons.chevronDown()}
          </button>
          <div class="m-sub" id="m-sub-${item.id}" data-accordion-panel inert>
            <div class="m-sub__inner"><ul class="m-sub__list" role="list">${links}</ul></div>
          </div>
        </li>`;
    }
    return `
      <li class="m-nav__item"${style}>
        <a class="m-nav__link" href="${item.href}"${current(page, item.id)}>${item.label}${icons.arrowRight()}</a>
      </li>`;
  }).join("");

  return `
    <div class="mobile-menu" id="mobile-menu" data-mobile-menu role="dialog" aria-modal="true" aria-label="Site menu" inert>
      <div class="container-site mobile-menu__inner">
        <nav aria-label="Mobile"><ul class="m-nav" role="list">${items}</ul></nav>
        <div class="m-menu__footer">
          <a class="btn btn-accent btn-lg" href="${CTA.href}"${current(page, CTA.id)}>${CTA.label}${icons.arrowRight()}</a>
          <div class="m-menu__controls">
            <div class="m-menu__control"><span class="m-menu__control-label" aria-hidden="true">Theme</span>${themeToggle()}</div>
            <div class="m-menu__control"><span class="m-menu__control-label" aria-hidden="true">Direction</span>${dirToggle()}</div>
          </div>
        </div>
      </div>
    </div>`;
}

export function renderHeader() {
  const slot = document.querySelector("[data-site-header]");
  if (!slot) return null;
  const page = document.body.dataset.page || "";
  const overlay = slot.dataset.variant === "overlay";

  const tpl = document.createElement("template");
  tpl.innerHTML = `
    <header class="site-header${overlay ? " site-header--overlay" : ""}" data-header>
      <div class="container-site site-header__inner">
        ${brandLockup()}
        ${desktopNav(page)}
        <div class="header-actions">
          ${themeToggle()}
          ${dirToggle()}
          <a class="btn btn-primary" href="${CTA.href}"${current(page, CTA.id)}>${CTA.label}${icons.arrowRight()}</a>
        </div>
        <button type="button" class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
          <span class="menu-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>
    </header>
    ${mobileMenu(page)}`.trim();

  const header = tpl.content.querySelector("[data-header]");
  if (overlay) {
    header.style.position = "fixed";
    header.style.insetInline = "0";
  }
  slot.replaceWith(tpl.content);
  return header;
}

export function renderFooter() {
  const slot = document.querySelector("[data-site-footer]");
  if (!slot) return;
  const home = NAV.find((n) => n.children);
  const flat = NAV.filter((n) => !n.children);
  const link = (l) => `<li><a href="${l.href}">${l.label}</a></li>`;

  slot.outerHTML = `
    <footer class="site-footer" data-footer>
      <div class="site-footer__glow" aria-hidden="true"></div>
      <div class="container-site">
        <div class="site-footer__grid">
          <div class="footer-brand">
            ${brandLockup()}
            <p class="footer-tagline">${SITE.tagline}</p>
            <p class="t-small t-muted">Overseas recruitment support for skilled professionals and the employers who need them.</p>
          </div>
          <div>
            <h2 class="footer-title">Explore</h2>
            <ul class="footer-links" role="list">${home.children.map(link).join("")}${link(flat[0])}</ul>
          </div>
          <div>
            <h2 class="footer-title">Candidates</h2>
            <ul class="footer-links" role="list">${flat.slice(1, 3).map(link).join("")}${link(CTA)}</ul>
          </div>
          <div class="footer-contact">
            <h2 class="footer-title">Get in touch</h2>
            <p class="t-small t-muted">Questions about working overseas or hiring talent? Start a conversation with our team.</p>
            <div><a class="btn btn-accent btn-sm" href="${flat[3].href}">Contact us${icons.arrowRight()}</a></div>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>&copy; ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</p>
          <p class="site-footer__sign">${emblem({ className: "site-footer__sign-mark" })}<span>${SITE.tagline}</span></p>
        </div>
      </div>
    </footer>`;
}
