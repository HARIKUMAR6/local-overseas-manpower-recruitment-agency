/** Job Openings: search, sector and destination filters over the JOBS data. */
import { JOBS, SECTORS, DESTINATIONS, CATEGORY_TO_SECTOR } from "../data/jobs.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const arrow = '<svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

const form = $("#job-filters");
if (form) {
  const q = $("#f-q"), sector = $("#f-sector"), dest = $("#f-dest");
  const list = $("#job-list"), none = $("#jobs-none"), nomatch = $("#jobs-nomatch");
  const count = $("#job-count"), strip = $("#interest-strip");

  const fill = (sel, map) => Object.entries(map).forEach(([k, v]) => sel.add(new Option(v, k)));
  fill(sector, SECTORS);
  fill(dest, DESTINATIONS);

  const fact = (label, value) => (value ? `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>` : "");
  const fmtDate = (d) => {
    const t = new Date(d);
    return isNaN(t) ? "" : t.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const card = (j) => `
    <article class="card card-interactive job-item" data-reveal>
      <div class="job-item__top"><span class="badge badge-accent">${esc(SECTORS[j.sector] || j.sector)}</span>${j.posted && fmtDate(j.posted) ? `<span class="t-small t-muted">Posted ${esc(fmtDate(j.posted))}</span>` : ""}</div>
      <h3 class="card__title">${esc(j.title)}</h3>
      ${j.summary ? `<p class="card__text">${esc(j.summary)}</p>` : ""}
      <dl class="job-item__facts">
        ${fact("Destination", DESTINATIONS[j.destination] || j.destination)}${fact("Location", j.location)}${fact("Employer", j.employer)}${fact("Contract", j.type)}${fact("Salary", j.salary)}
      </dl>
      ${Array.isArray(j.requirements) && j.requirements.length ? `<div class="job-meta">${j.requirements.map((r) => `<span class="tag">${esc(r)}</span>`).join("")}</div>` : ""}
      <div class="card__footer"><a class="btn btn-primary btn-sm btn-block" href="contact.html?role=${encodeURIComponent(j.id)}#apply">Apply for this role ${arrow}</a></div>
    </article>`;

  const apply = () => {
    const term = q.value.trim().toLowerCase();
    const res = JOBS.filter((j) => {
      const hay = [j.title, j.employer, j.summary, j.location, SECTORS[j.sector], DESTINATIONS[j.destination]].join(" ").toLowerCase();
      return (!term || hay.includes(term)) && (!sector.value || j.sector === sector.value) && (!dest.value || j.destination === dest.value);
    });
    list.innerHTML = res.map(card).join("");
    list.hidden = res.length === 0;
    none.hidden = JOBS.length !== 0;
    nomatch.hidden = JOBS.length === 0 || res.length !== 0;
    strip.hidden = JOBS.length === 0;
    count.textContent = JOBS.length === 0
      ? "No openings are listed right now"
      : `Showing ${res.length} of ${JOBS.length} ${JOBS.length === 1 ? "opening" : "openings"}`;
    list.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  };

  // Initial state from the URL (?q=, ?sector= / ?industry= / ?category=, ?destination=)
  const p = new URLSearchParams(location.search);
  q.value = p.get("q") || "";
  const s = p.get("sector") || p.get("industry") || CATEGORY_TO_SECTOR[p.get("category")] || "";
  if (SECTORS[s]) sector.value = s;
  const d = p.get("destination") || "";
  if (DESTINATIONS[d]) dest.value = d;

  [q, sector, dest].forEach((el) => el.addEventListener("input", apply));
  form.addEventListener("submit", (e) => { e.preventDefault(); apply(); });
  $("#f-reset").addEventListener("click", () => { form.reset(); apply(); q.focus(); });
  document.querySelectorAll("[data-reset-filters]").forEach((b) => b.addEventListener("click", () => { form.reset(); apply(); }));

  // Sector tiles → set the sector filter and jump to the listings
  document.querySelectorAll("[data-sector]").forEach((b) =>
    b.addEventListener("click", () => {
      sector.value = b.dataset.sector;
      apply();
      $("#openings").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    })
  );

  // Hero quick search (same selects, shared logic)
  const hq = $("#h-q"), hs = $("#h-sector");
  if (hs) fill(hs, SECTORS);
  $("#hero-find")?.addEventListener("submit", (e) => {
    e.preventDefault();
    q.value = hq.value; sector.value = hs.value;
    apply();
    $("#openings").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  apply();
}
