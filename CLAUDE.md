# Project Rules

Static HTML/CSS/JS page built to a Figma design. These rules are the full extract of the
client coding guideline - follow them without re-reading the source document.

> The client brief forbids mentioning the client company anywhere in the code result.
> Keep company names, project names, and recruiter emails out of every committed file.

## Git workflow

**Never commit directly to `main`.** `main` only ever advances through a merged pull request.

Every change, however small, follows the same path:

1. Branch off `main`: `git checkout -b feature/<short-description>`
2. Commit the work on that branch
3. Push and open a PR against `main`
4. Merge through the PR

This applies to the first commit of a session too - check the current branch before editing.
If work has already started on `main` by mistake, move the commits onto a branch and rewind
`main` rather than pushing them.

## Stack constraints

- Only HTML, CSS, and JavaScript. No build step, no framework.
- Bootstrap, jQuery, and Slick JS are the only permitted libraries.
- Deployment target is GitHub Pages, so every path must work from a subdirectory.

## File format (applies to every file)

| Rule | Value |
| --- | --- |
| Encoding | UTF-8 (no BOM) |
| Newline | CR+LF - enforced by `.gitattributes` and `.editorconfig` |
| Indentation | 2 half-width spaces, never tabs |
| Paths | Relative only (`css/index.css`, `images/logo.png`) - never absolute, never `/`-rooted |

## Folder structure

```
root - index.html
       design-tokens.json
       css - design-tokens.css
             index.css
       images
       js
```

Do not add directories outside this shape. `docs/` holds the source briefs and is gitignored.

## Design tokens

`design-tokens.json` is the source of truth; `css/design-tokens.css` mirrors it as custom
properties and is linked **before** `index.css`. Change the JSON first, then the CSS.

The Figma file defines no Figma Variables, so every token was measured from the applied styles
and carries the originating node id in `$extensions`.

- Never hardcode a color, font size, or spacing value that a token already covers.
- Font sizes map 1:1 from Figma px to rem because the root is 62.5%: 54px is `--font-size-54`
  (5.4rem).
- The brand gradient is a `background-clip: text` fill used on almost every heading. Use the
  `.text-gradient` class, do not re-declare the four properties.
- Body copy is `--color-text-muted` (#e4e4e4); headings and nav are `--color-text-primary`.
- Every outlined box is a 2px solid white border with zero corner radius.
- The desktop grid is 96px margin + 4 columns of 240px + 3 gutters of 96px = 1440px.
  Column origins: 96, 432, 768, 1104.

## HTML

- Doctype is `<!DOCTYPE html>`.
- Indentation is 2 spaces **except**:
  - everything from `<!DOCTYPE html>` down to `<body>`, and `</body>` / `</html>`, sits at column 0
  - `<script>` tags sit at column 0
- Content inside `<body>` is indented normally, starting at 2 spaces.
- `alt` text: transcribe the characters shown on the image verbatim. For images with no text,
  use the image name.
- `<title>` must be the developer's own name (per the test brief).
- All `<script src>` go immediately before `</body>`.

Canonical shape:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Name</title>
<link rel="stylesheet" href="css/index.css">
</head>
<body>
  <main class="main-content">
    <!-- content -->
  </main>
<script src="js/index.js"></script>
</body>
</html>
```

## CSS

- Class names in kebab-case, numeric suffix attached without a dash: `.section-block01`.
- Property order inside every rule:
  1. `display`, `position`, `float`, layout
  2. `width`, `height`, sizing
  3. `margin`, `padding`
  4. `border`, `background`
  5. `text`, `font`
  6. everything else (`transition`, `opacity`, `z-index`, …)
- Font stack: `"Inter", "Unbounded", sans-serif`.
- Font sizes in `rem`. `html { font-size: 62.5%; }` is set, so **1rem = 10px** and a Figma
  value of 16px is written `1.6rem`.
- `line-height` is unitless: `line-height: 2;`.
- Mobile-first. The single breakpoint is `@media (min-width: 768px)` for PC.
- Hover states apply to PC only (inside the 768px media query), on buttons and links:
  `opacity: 0.5` with `transition: opacity 0.2s`.

## Images

| Format | Use for |
| --- | --- |
| JPEG | Photos, minimum 1x quality |
| PNG-24 | Images needing transparency |
| PNG-8 | Illustrations, buttons, icons - no transparency, within 256 colors |
| GIF | Never use |

Naming: `[type]_[name]_[NN].[ext]`, lowercase only. `name` and `NN` are optional.

| Type | Example |
| --- | --- |
| Logo | `logo.png` |
| Background | `bg_section.jpg` |
| Icon | `ico_01.png` |
| General | `img_access_01.jpg` |
| Button | `btn_cancel.png` |

## Component behavior

From the Figma "Direction" page. The desktop design page shows only the resting state, so it
is not a sufficient reference on its own.

### Container width

Any section that does not fill the screen is capped: **1250px** on desktop, **335px** on mobile.
This is an explicit instruction, not a measurement. `.wrapper` implements it.

### Tabbing section - Branding / Design / Marketing

Three tabs sharing one panel. The active tab title carries the full brand gradient; the other
two drop to `--opacity-inactive` (0.3). Each tab swaps both the illustration and the two text
columns:

| Tab | Illustration | Left text | Right text |
| --- | --- | --- | --- |
| Branding | 1 sphere | Our team of experts specializes in creating unique and effective designs | We created marketing materials that were consistent with the new brand identity, such as business cards, brochures, and social media graphics. |
| Design | 2 spheres | Innovative and effective design solutions for business of our clients | We partnered with a technology startup to create a new website that would showcase their innovative product and attract investors. |
| Marketing | 3 spheres | Our team of experienced designers and marketing professionals work closely | We provided the brand with a detailed social media strategy that outlined how they could continue to grow their following and engage with their audience in the future. |

### Projects slider

Three slides of two cards each. Navigation is prev/next buttons; pagination is three dots
marking the current slide.

| Slide | Left card | Right card |
| --- | --- | --- |
| 1 | branding - Food store identity | web design - Technology startup site |
| 2 | marketing - Fashion instagram marketing | development - Mobile and desktop services |
| 3 | branding - Eco packaging design | marketing - Social media graphics |

Slides 2 and 3 exist only on the Direction page. Building from the desktop page alone would
ship a slider with a single slide.

### Mobile navigation

The header collapses to logo + `MENU`. Opening it replaces the header with a full-width
overlay: logo + `Close`, then ABOUT, SERVICES, CASES, TEAM, BOOST PROGRAM, PRODUCTS, BOOK,
BLOG stacked as full-width bordered rows, with a globe icon row last.

## Analytics

Only the four section links - **About us, Expertise, Get started, What we do** - are marked
for tracking. A pixel scan of the Analytics page found exactly one red annotation region,
covering that row and nothing else. The header and footer nav are *not* marked; their reddish
appearance in the export is the background gradient showing through transparent buttons.

## Browsers

- PC: latest Chrome, Firefox, Edge. Firefox and Edge are the graded targets.
- Smartphone: iOS 10+ Safari, Android 5.0+ Chrome.

## Display accuracy

The layout is compared against the Figma design **pixel by pixel**. Match spacing, font sizes,
and colors exactly - do not round or approximate. Design widths: Full HD desktop, iPhone SE
(375px) mobile.

## Analytics

The four links listed under "Analytics" above must fire GA4 events via GTM. Keep the GTM
container snippet in `index.html` and event wiring in `js/index.js`.
