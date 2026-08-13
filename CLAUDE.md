# Project Rules

Static HTML/CSS/JS page built to a Figma design. These rules are the full extract of the
client coding guideline - follow them without re-reading the source document.

> The client brief forbids mentioning the client company anywhere in the code result.
> Keep company names, project names, and recruiter emails out of every committed file.

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
       css - index.css
       images
       js
```

Do not add directories outside this shape. `docs/` holds the source briefs and is gitignored.

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

## Browsers

- PC: latest Chrome, Firefox, Edge. Firefox and Edge are the graded targets.
- Smartphone: iOS 10+ Safari, Android 5.0+ Chrome.

## Display accuracy

The layout is compared against the Figma design **pixel by pixel**. Match spacing, font sizes,
and colors exactly - do not round or approximate. Design widths: Full HD desktop, iPhone SE
(375px) mobile.

## Analytics

Buttons and links flagged on the Figma "Analytics" page must fire GA4 events via GTM.
Keep the GTM container snippet in `index.html` and event wiring in `js/index.js`.
