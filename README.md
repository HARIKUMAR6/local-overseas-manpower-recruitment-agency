# ORIVANTA GLOBAL MOBILITY

*Connecting Talent. Crossing Borders.*

Premium overseas manpower recruitment website built with **HTML5, Tailwind CSS v4 (CLI) and Vanilla JavaScript**. There is no framework and no CDN build of Tailwind.

## Setup

```bash
npm install
npm run dev     # watch src/css → assets/css/main.css
npm run build   # minified production CSS
```

Open any page with **VS Code Live Server**. `assets/css/main.css` is committed, so pages work without a build. Pages must be served over HTTP, because ES modules don't run from `file://`.

## Structure

```
*.html                      Pages (root level), styleguide.html = component reference (noindex)
src/css/input.css           Tailwind entry: @theme tokens, variants, @source
src/css/tokens.css          Light / dark / inverse semantic CSS variables + layout tokens
src/css/base.css            Typography, focus, RTL text rule, reduced motion
src/css/components.css      Buttons, cards, media, forms, header, menu, footer, to-top, reveal
assets/css/main.css         Compiled output (do not edit)
assets/js/theme-init.js     Blocking <head> script: theme + dir before paint
assets/js/main.js           Module entry
assets/js/modules/          site-config, layout, nav, theme, direction, reveal, scroll-top, brand, icons, storage
assets/images/brand/        logo-light.svg, logo-dark.svg, emblem.svg, emblem-dark.svg, favicon.svg
assets/images/              Photography (Unsplash License)
```

## Page template

```html
<!doctype html>
<html lang="en" dir="ltr" data-theme="light">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#f7f5ef" />
  <title>Page — ORIVANTA GLOBAL MOBILITY</title>
  <script src="assets/js/theme-init.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Manrope:wght@400..800&display=swap" />
  <link rel="stylesheet" href="assets/css/main.css" />
  <link rel="icon" type="image/svg+xml" href="assets/images/brand/favicon.svg" />
  <script type="module" src="assets/js/main.js"></script>
</head>
<body data-page="about">            <!-- home-1 | home-2 | about | jobs | process | contact | apply -->
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>       <!-- add data-variant="overlay" over a dark hero -->
  <main id="main" tabindex="-1" class="outline-none">
    <section class="hero-frame"><div class="container-site">…</div></section>
  </main>
  <div data-site-footer></div>
</body>
</html>
```

The navigation is defined once, in `assets/js/modules/site-config.js`.

## Design rules (mandatory for all phases)

- Put all content inside `.container-site` or `.container-narrow`.
- Heroes use `.hero-frame`, which is `clamp(560px, 82svh, 860px)`. Smaller pages use `.hero-frame--compact`.
- Use **logical** utilities only: `ms-/me-/ps-/pe-/start-/end-`. Never use `ml-/mr-/left-/right-`.
- **Never right-align text.** In RTL, headings and copy stay left-aligned. For stacks of copy use `justify-copy` (always left), or `text-center`. Don't use `text-start`, `text-right` or `justify-items-start` on copy.
- Button groups use `.btn-group`, which centres buttons on mobile. Button heights are fixed at 40, 48 and 56px (`btn-sm`, default, `btn-lg`).
- Images go in `.media .media-16x9|4x3|3x2|1x1|3x4|4x5`. Always set `alt`, `width` and `height`. Never show image credits.
- For scroll reveal, add `data-reveal` (`up`, `fade`, `zoom` or `start`). Put `data-reveal-stagger` on a parent to stagger its children.
- Keep copy short. Don't invent statistics, employers, vacancies or destination claims.

## Tokens

| Token | Light | Dark |
|---|---|---|
| canvas | #F7F5EF | #0A1A28 |
| surface / surface-2 | #FFFFFF / #EFEBE0 | #0F2436 / #153049 |
| ink | #102C43 | #F3F0E8 |
| muted | #4A5A6E | #A9B6C6 |
| primary / on-primary | #102C43 / #FFF | #F7F5EF / #102C43 |
| accent / on-accent | #D7B46A / #102C43 | #D7B46A / #0B1E2E |
| accent-ink (gold text) | #7A5C1C | #E0C27E |

Tailwind utilities: `bg-canvas`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-primary`, `text-accent-ink` and so on. Brand scales: `navy-600…950`, `gold-200…700`, `ivory`.

Typography: **Fraunces** for display and headings, **Manrope** for UI and body. Fluid sizes: `text-display`, `text-h1`…`text-h4`, `text-lead`.

Breakpoints: `sm` 640, `md` 768, `lg` 1024, **`xl` 1280 (desktop navigation)**, `2xl` 1536.

## Contrast (WCAG AA, verified)

| Pair | Ratio |
|---|---|
| Light: ink / canvas | 13.2 |
| Light: muted / canvas | 6.5 |
| Light: accent-ink / canvas | 5.7 |
| Light: on-accent / accent | 7.3 |
| Dark: ink / canvas | 15.5 |
| Dark: muted / surface-2 | 6.6 |
| Dark: accent-ink / canvas | 10.2 |
| Inverse: muted / navy | 8.2 |

Brand Slate (#64748B) is only 4.4:1 on ivory, so it is reserved for decoration and large text.
