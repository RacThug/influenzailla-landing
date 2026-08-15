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
       css - design-tokens.css
             index.css
       images
       js
```

Do not add directories outside this shape. `docs/` holds the source briefs and is gitignored.

## Design tokens

`css/design-tokens.css` holds every token as a custom property and is linked **before**
`index.css`. It is the only place a token is defined - there is no second copy to keep in step.

The Figma file defines no Figma Variables, so every value was measured off the exports rather
than read out of the file. Where a number is not obvious, the rule that carries it in
`index.css` says how it was arrived at; the sections below record the rest.

Only tokens the page actually uses live in the file. A value that nothing references is not a
token, it is a note - and a note that drifts out of date is worse than no note, so it belongs in
this document instead.

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

The mobile figure is a real cap, not a by-product of the 20px padding at a 375px viewport. The
single 768px breakpoint means the mobile rules run from 320 all the way up, and without the cap
the text column keeps widening: at 425 the headings re-wrap onto fewer lines and every squiggle
slides out from under the word it marks. With it, the column stays 335 and centres, and the
layout holds its proportions from 375 to 767.

Sections that *do* fill the screen opt out with `max-width: none` - the step cards and the
project cards run edge to edge at every width.

### The "3d" section is aligned like every other section

The section headed *"We turn your digital dreams into reality"* (Figma frame `3d`, node
`506:376`, the one with the "since 2006" box) sits at **x=69 on the Design - Desktop page**
while every other section sits at 96. The Direction page places the same frame at 96.

**Decided: align it with the container like everything else.** The x=69 placement is treated
as a mistake in the design file, not as intent. The frame is 1250px wide either way - only its
position differs - and the Direction page, which carries the rules, has it aligned.

Do not reintroduce a negative offset on `.intro-grid`. Mobile was never affected.

### Mobile artwork - same files, different crops

Mobile does **not** need its own image exports. Every artwork block on the mobile frame is one
of the existing files, re-cropped and in two cases re-oriented. This was measured by fitting
each asset against `page-mobile.png` over all eight flip/rotate combinations; the error column
is the mean absolute channel difference out of 255, so anything under about 2.5 is JPEG noise.

| Mobile block | File | Orientation | Displayed size @375 | Offset | Error |
| --- | --- | --- | --- | --- | --- |
| Hero | `bg_hero.jpg` | 90° turn + horizontal flip | 513x810 | 0, 0 | 0.61 |
| Step 01 | `img_step_01.jpg` | upright | 389x180 | -15, 0 | 0.72 |
| Step 02 | `img_step_02.jpg` | upright | 382x180 | -4, 0 | 0.53 |
| Step 03 | `img_step_03.jpg` | **180°** | 391x180 | -4, 0 | 0.60 |
| Step 04 | **`bg_hero.jpg`** | upright | 982x622 | -269, -305 | 2.03 |
| Expertise | `bg_expertise.jpg` | upright | 1095x475 | -260, 0 | 1.94 |
| Project 02 | `img_project_02.jpg` | upright | 506x273 | -18, 0 | 2.15 |

The crops are written in `vw`, not `rem`. These blocks are full-bleed, and the single 768px
breakpoint means the mobile rules cover every width from 320 up, so a fixed pixel crop leaves a
bare strip on the right as soon as the screen passes 375.

The hero cannot be done with `background-image` - that cannot be rotated - so `.hero-bg` clips a
pseudo-element carrying the turned copy. Same technique for step 03.

### Three places where the mobile frame contradicts the rest of the file

The mobile frame is not internally consistent with the Design - Desktop and Direction pages.
Decided case by case, not by one blanket rule:

- **Step 03 turned 180° and step 04 filled with the hero artwork** - followed. Nothing else in
  the file contradicts them, every other mobile block was demonstrably re-cropped by hand, and
  the brief grades on pixel match against Figma.
- **Project card 1** - *not* followed. The mobile frame gives it `img_project_04` turned 180°
  **and** step 01's body copy, while the Direction page - the authoritative slider spec - says
  "We worked with a local health food store...". Two mismatches on one card make it a stale
  duplicate, not art direction. The card keeps `img_project_01` and the Direction copy.
- **Eyebrow reading "Since 2006"** - not followed. Design - Desktop says "London 2006", which is
  what ships. Verified pixel-for-pixel against the desktop export.

Desktop was checked against the same fitting method and is correct throughout: card 1 to
`img_project_01` (0.99), card 2 to `img_project_02` (0.64), step 3 to `img_step_03` (0.80), all
upright.

### Two stars, and where each belongs

`ico_star.svg` is the **outline** star and is decoration only - the hero aside, the objectives
mark, and `ico_star_group.svg` in the intro. The logo carries a different shape: a **filled**
nine-point star with long points, 32px in the bar on mobile.

- `logo_star.svg` - white fill. Header and mobile menu.
- `logo_star_02.svg` - the brand gradient baked into the path. Footer only, on both
  breakpoints, because the footer fills its mark the same way it fills its type. An `<img>`
  cannot take a CSS gradient, so the fill lives in the file.

Both are the same path at the same size; only the fill differs. Editing one means editing both.

### Gradient text needs a box the size of its words

The brand gradient is painted across the element box and clipped to the glyphs, so a short word
in a full-width box shows only the pale opening of the ramp and reads as plain white. Anything
short that carries `.text-gradient` needs its box brought in: `.hero-year` uses `display: table`,
`.project-tag` uses `align-self` with a measured `min-width`, and every wave rule has an
explicit width. Check any new gradient text against the export before assuming it is right.

### Mobile reorders two sections

Mobile does not just restack the desktop columns; two sections put their pieces in a different
order, and the DOM follows mobile because every child is placed explicitly on PC.

- **Intro** - the star group opens the section, above the lede. On PC it sits at the foot of
  the first column instead.
- **Objectives** - the closing paragraph sits above the tabs, and the two-column body below
  them.

### Squiggles are drawn from the word they mark

Every wave rule belongs to one word. It is a `::before` on a `<span class="mark ...">` around
that word, not an element placed on the grid - the headings re-wrap anywhere between 768 and
1440, and a rule positioned by percentage slides off its word the moment they do. Anchored to
the word, it follows.

PC and mobile mark different words in three of the five sections, so both words carry a span and
only one is lit per breakpoint.

| Rule | PC marks | Mobile marks | PC width | Mobile width |
| --- | --- | --- | --- | --- |
| Hero | "your", above | "your", above | 140px | 86px |
| Intro | "dreams", below | "reality", below | 237px | 113px |
| Objectives | "achive", above | "objectives", below | 195px | 186px |
| Expertise | "and", above | "experience", below | 113px | 195px |
| Projects | "our", above | "Projects", above | 103px | 103px |

PC draws all five at 48px; mobile draws four at 32px and keeps the projects rule at 48px, which
is why that one is the same width on both and is set once.

Each rule holds 24 waves - more than any breakpoint needs - and the width trims it. That width
also bounds the `background-clip: text` gradient, which is what makes the rule read as belonging
to its word. The line box is as tall as the type, so `bottom: 100%` alone parks the rule a full
box clear of the word; the negative margins bring it back down onto it.

Changing a rule means re-measuring the word, not guessing a wave count.

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

The design hides the prev/next buttons below 768px, so on a phone the dots would be the only
way through. The slider therefore takes a swipe as well: the drag is followed in pixels, a
fifth of the viewport commits to the next slide and anything less snaps back, and a finger
heading down the page is left alone so the page still scrolls. Written by hand rather than
pulled from Slick - it is forty lines and carries no dependency.

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

The four links listed under "Analytics" above must fire GA4 events via GTM.

**Only the GTM container goes in the page.** GA4 is a tag inside that container, not a second
snippet in `index.html` - install both and every page view is counted twice.

| | |
| --- | --- |
| GTM container | `GTM-KGPSJDNS`, in `index.html` (head script + `noscript` iframe) |
| GA4 measurement ID | `G-TL7X1PXXE7`, held in the GA4 Configuration tag inside GTM |

`initTracking()` in `js/index.js` pushes one event per marked link:

```js
{ event: 'link_click', link_id: 'about-us', link_text: 'About us' }
```

`link_id` is the `data-track` value; `link_text` is what the link reads. GTM picks the event up
with a Custom Event trigger on `link_click` and passes both through as GA4 event parameters.

Adding a tracked link means adding `data-track` to it and nothing else - the wiring is generic.
Do not add a tracking call per link.
