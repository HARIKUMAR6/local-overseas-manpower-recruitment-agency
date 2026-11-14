/**
 * Job Openings data — edit this file to publish or remove vacancies.
 * Only add openings that have been confirmed with the employer.
 *
 * Each opening (all fields optional except id, title, sector, destination):
 * {
 *   id: "welder-001",            // unique, URL-safe
 *   title: "Pipe Welder",
 *   sector: "construction",      // key from SECTORS below
 *   destination: "uae",          // key from DESTINATIONS below
 *   location: "Abu Dhabi",       // city / site
 *   employer: "Employer name",
 *   type: "Full-time, 2-year contract",
 *   salary: "Confirmed salary range",
 *   posted: "2026-11-01",        // ISO date
 *   summary: "One or two sentences about the role.",
 *   requirements: ["Valid passport", "3+ years' experience"]
 * }
 */
export const JOBS = [];

export const SECTORS = {
  construction: "Construction",
  healthcare: "Healthcare",
  hospitality: "Hospitality",
  manufacturing: "Manufacturing",
  logistics: "Logistics",
  energy: "Energy",
  renewable: "Renewable Energy",
  aviation: "Aviation",
  marine: "Marine",
  automotive: "Automotive",
  agriculture: "Agriculture",
};

export const DESTINATIONS = {
  uae: "United Arab Emirates",
  qatar: "Qatar",
  saudi: "Saudi Arabia",
  singapore: "Singapore",
  malaysia: "Malaysia",
  japan: "Japan",
  germany: "Germany",
  poland: "Poland",
  uk: "United Kingdom",
  canada: "Canada",
  australia: "Australia",
  newzealand: "New Zealand",
};

/** Legacy homepage category links → sector keys. */
export const CATEGORY_TO_SECTOR = { trades: "construction", healthcare: "healthcare", hospitality: "hospitality", transport: "logistics" };
