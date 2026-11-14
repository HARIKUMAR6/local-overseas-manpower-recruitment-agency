/**
 * ORIVANTA emblem — a navigational seal: ring + meridian globe, crossed by a
 * gold trajectory arc ("crossing borders") ending in a destination point,
 * with a compass north mark. Colours come from currentColor + CSS tokens,
 * so it adapts to light, dark and inverse (footer) contexts automatically.
 */
export function emblem({ className = "brand__mark", title = "" } = {}) {
  const t = title ? `<title>${title}</title>` : "";
  const aria = title ? 'role="img"' : 'aria-hidden="true" focusable="false"';
  return `<svg class="${className}" viewBox="0 0 48 48" fill="none" ${aria}>${t}
    <circle cx="24" cy="24" r="19" stroke="currentColor" stroke-width="2.4"/>
    <circle cx="24" cy="24" r="14.5" stroke="currentColor" stroke-width=".8" opacity=".4"/>
    <ellipse cx="24" cy="24" rx="7" ry="14.5" stroke="currentColor" stroke-width="1.2" opacity=".6"/>
    <path d="M9.5 24h29" stroke="currentColor" stroke-width="1.2" opacity=".6"/>
    <path d="M24 1.2 25.9 5 24 8.6 22.1 5Z" fill="var(--accent, #D7B46A)"/>
    <path d="M3.6 34.2C13 26.4 26.2 18.6 43.6 14.4" stroke="var(--emblem-knockout, #F7F5EF)" stroke-width="6.5" stroke-linecap="round"/>
    <path d="M3.6 34.2C13 26.4 26.2 18.6 43.6 14.4" stroke="var(--accent, #D7B46A)" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="43.6" cy="14.4" r="2.9" fill="var(--accent, #D7B46A)"/>
  </svg>`;
}

/** Full horizontal lockup: emblem + wordmark. */
export function brandLockup({ href = "index.html", label = "ORIVANTA GLOBAL MOBILITY — Home" } = {}) {
  return `<a class="brand" href="${href}" aria-label="${label}">
    ${emblem()}
    <span class="brand__text" aria-hidden="true">
      <span class="brand__name">ORIVANTA</span>
      <span class="brand__sub">Global Mobility</span>
    </span>
  </a>`;
}
