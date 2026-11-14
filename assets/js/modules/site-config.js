/**
 * Single source of truth for navigation. Pages identify themselves with
 * <body data-page="home-1|home-2|about|jobs|process|contact|apply">.
 */
export const SITE = Object.freeze({
  name: "ORIVANTA GLOBAL MOBILITY",
  tagline: "Connecting Talent. Crossing Borders.",
});

export const NAV = [
  {
    id: "home",
    label: "Home",
    children: [
      { id: "home-1", label: "Home 1", href: "index.html", desc: "Primary landing experience" },
      { id: "home-2", label: "Home 2", href: "home-2.html", desc: "Alternate landing experience" },
    ],
  },
  { id: "about", label: "About", href: "about.html" },
  { id: "jobs", label: "Job Openings", href: "jobs.html" },
  { id: "process", label: "Process", href: "process.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];

export const CTA = { id: "apply", label: "Apply Now", href: "contact.html#apply" };

/**
 * Social profiles shown in the footer. Paste each account URL into "url"
 * (e.g. "https://www.facebook.com/yourpage"). Entries with an empty url are
 * shown as plain icons without a link until a URL is added.
 */
export const SOCIAL = [
  { id: "facebook", label: "Facebook", url: "" },
  { id: "instagram", label: "Instagram", url: "" },
  { id: "linkedin", label: "LinkedIn", url: "" },
  { id: "youtube", label: "YouTube", url: "" },
];
