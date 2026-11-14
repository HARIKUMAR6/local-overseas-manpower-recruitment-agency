/** Contact page: form validation + mail hand-off, and the office map. */
import { CONTACT } from "../data/contact.js";

const $ = (s, r = document) => r.querySelector(s);

/* ---------- Validation ------------------------------------------------- */
const rules = {
  required: (el) => (el.type === "checkbox" ? !el.checked : !el.value.trim()),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
  phone: (v) => /^\+?[\d\s().-]{7,20}$/.test(v) && (v.match(/\d/g) || []).length >= 7,
};

function check(el) {
  const v = el.value.trim();
  if (el.required && rules.required(el)) return el.type === "checkbox" ? "Please confirm to continue." : "This field is required.";
  if (!v) return "";
  if (el.type === "email" && !rules.email(v)) return "Enter a valid email address.";
  if (el.type === "tel" && !rules.phone(v)) return "Enter a valid phone number, for example +971 4 000 0000.";
  if (el.tagName === "TEXTAREA" && el.required && v.length < 10) return "Please write at least 10 characters.";
  return "";
}

function show(el, msg) {
  const wrap = el.closest("[data-field]");
  const err = document.getElementById(el.getAttribute("aria-describedby").split(" ").find((i) => i.endsWith("-err")));
  wrap.classList.toggle("is-invalid", !!msg);
  el.setAttribute("aria-invalid", msg ? "true" : "false");
  err.textContent = msg;
  err.hidden = !msg;
}

function setStatus(box, kind, html) {
  box.className = `form-status is-visible form-status--${kind}`;
  box.innerHTML = html;
  box.focus({ preventScroll: false });
}

function initForm(form) {
  const kind = form.dataset.form;
  const box = $(`#${kind}-status`);
  const fields = [...form.querySelectorAll("input, select, textarea")];

  fields.forEach((el) => {
    el.addEventListener("blur", () => show(el, check(el)));
    el.addEventListener("input", () => el.closest("[data-field]").classList.contains("is-invalid") && show(el, check(el)));
    el.addEventListener("change", () => el.closest("[data-field]").classList.contains("is-invalid") && show(el, check(el)));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    fields.forEach((el) => {
      const msg = check(el);
      show(el, msg);
      if (msg && !first) first = el;
    });
    if (first) {
      setStatus(box, "error", "Please correct the highlighted fields and try again.");
      first.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const lines = Object.entries(data).filter(([k, v]) => k !== "consent" && v).map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`);
    const subject = kind === "apply" ? `Application: ${data.role || data.sector || "Candidate"} – ${data.name}` : `${data.subject} – ${data.name}`;
    const href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setStatus(
      box,
      "ok",
      `Your email app should now open with your ${kind === "apply" ? "application" : "message"} ready. <strong>It has not been sent yet</strong>: press send in your email app. If nothing opened, <a href="${href}">open it again</a> or email us at <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.`
    );
    window.location.href = href;
  });
}

document.querySelectorAll("form[data-form]").forEach(initForm);

// Pre-fill the role from a job link (?role=...)
const role = new URLSearchParams(location.search).get("role");
if (role && $("#a-role")) $("#a-role").value = role.replace(/[-_]+/g, " ");

/* ---------- Map -------------------------------------------------------- */
function initMap() {
  const el = $("#office-map");
  if (!el) return;
  if (!window.L) { $("#map-fallback").classList.add("is-visible"); return; }
  const { lat, lng } = CONTACT.coords;
  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([lat, lng], 15);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  let errors = 0;
  tiles.on("tileerror", () => { if (++errors > 6) $("#map-fallback").classList.add("is-visible"); });

  const pin = L.divIcon({
    className: "map-pin",
    html: '<svg viewBox="0 0 24 32" fill="none" aria-hidden="true"><path d="M12 31S2 20.5 2 12a10 10 0 0 1 20 0c0 8.5-10 19-10 19Z" fill="#D7B46A" stroke="#102C43" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#102C43"/></svg>',
    iconSize: [40, 40], iconAnchor: [20, 38], popupAnchor: [0, -34],
  });
  L.marker([lat, lng], { icon: pin, title: "ORIVANTA GLOBAL MOBILITY", alt: "ORIVANTA office location" })
    .addTo(map)
    .bindPopup("<strong>ORIVANTA GLOBAL MOBILITY</strong><br>Business Bay, Dubai, United Arab Emirates")
    .openPopup();

  map.on("focus click", () => map.scrollWheelZoom.enable());
  map.on("blur", () => map.scrollWheelZoom.disable());
  document.documentElement.addEventListener("directionchange", () => setTimeout(() => map.invalidateSize(), 50));
  new IntersectionObserver((en) => en[0].isIntersecting && map.invalidateSize()).observe(el);
}
if (document.readyState === "complete") initMap();
else window.addEventListener("load", initMap);
