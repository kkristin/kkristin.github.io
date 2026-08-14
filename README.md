# kkristin.github.io

Kristina's portfolio. Plain, static HTML/CSS/JS, with **no build step**, no framework and no backend. This was a deliberate choice: it means there is nothing that can break between "it works on my machine" and "it works on GitHub Pages."

## Running it locally

You don't need Node, npm or anything installed beyond a browser. To preview with working relative paths, serve the folder instead of double-clicking the files:

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static server works: `npx serve`, VS Code's Live Server extension, etc.)

## Deploying to GitHub Pages

1. Copy everything inside this `site/` folder to the **root** of the `kkristin.github.io` repository (so `index.html`, `css/`, `js/`, `assets/`, `robots.txt` and `sitemap.xml` sit at the repo root, not inside a `site/` subfolder).
2. Commit and push to the `main` branch.
3. In the repo's Settings → Pages, make sure the source is "Deploy from a branch" → `main` → `/ (root)`.
4. Done. No build action needed. It's live at `https://kkristin.github.io/` within a minute or two of the push.

If you ever do want a `site/` subfolder to stay in the repo (e.g. for organisation), you'd need a GitHub Action to copy `site/*` to the Pages branch, but for a project this size it's not worth the added moving part.

## Where things live

```
index.html                 Homepage: hero, selected work, capabilities, about, testimonials, contact
work/njord.html             Flagship case study
work/laerdal.html           Case study
work/crypho.html            Case study
work/plant-o-meter.html     Case study
css/style.css               Everything visual, all design tokens live at the top of the file
js/main.js                  Mobile nav toggle, scroll-reveal, case-study table-of-contents highlighting
assets/img/                 All images, organised by project
robots.txt, sitemap.xml     SEO
```

## Editing text

Every page is plain HTML: open the file, find the text, change it. There's no CMS and no data layer to fight with. Section comments (`<!-- ============ HERO ============ -->` etc.) mark where each part of the homepage starts.

## Editing SEO metadata

Each page has its own `<title>`, `<meta name="description">`, canonical URL, Open Graph tags and Twitter card tags at the top of the `<head>`. The homepage and the NJORD case study also carry JSON-LD structured data (`Person` / `WebSite` / `CreativeWork`) in `<script type="application/ld+json">` blocks. Update these if your name, LinkedIn URL or email change.

If you add or remove a page, update `sitemap.xml` to match.

## Adding a new case study

1. Duplicate `work/laerdal.html` (the simpler template) as a starting point.
2. Update the `<title>`, meta description, canonical URL, OG/Twitter tags, and the `<h1>` / hero copy / meta grid.
3. Write your sections: each is a `<section class="cs-section">` block; copy the pattern from the existing pages.
4. Add a project card for it on the homepage (`index.html`, inside `.project-grid`) linking to `work/your-file.html`.
5. Add the new URL to `sitemap.xml`.
6. Drop images into `assets/img/your-project/` and reference them with relative paths (`../assets/img/your-project/...` from inside `work/`).

## Adding or swapping images

Images live in `assets/img/<project>/`. They're plain `<img>` tags with `loading="lazy"` and explicit `width`/`height` (keeps layout stable while images load; don't remove these attributes when swapping an image, just update them to match the new file's actual dimensions). Keep hero/case-study screenshots under roughly 200KB each; the whole site is currently under 2MB total, which is most of why it loads fast.

## Fonts

Inter (UI text) and JetBrains Mono (metadata, tags, numbers) are loaded from Google Fonts via a `<link>` in each page's `<head>`, with `preconnect` hints and `display=swap` so text never blocks on the font. If you'd rather not depend on an external font host at all, both are open-source (SIL OFL) and can be self-hosted: download the `.woff2` files, put them in `assets/fonts/`, and replace the Google Fonts `<link>` tags with an `@font-face` block at the top of `css/style.css`.

## Accessibility notes

- Skip-to-content link on every page (visible on keyboard focus).
- Semantic landmarks (`header`, `main`, `nav`, `footer`) throughout.
- `prefers-reduced-motion` is respected: scroll-reveal and smooth-scroll both disable themselves.
- Colour contrast was chosen to clear WCAG AA on body text; if you change the palette in `css/style.css`, re-check contrast on `--muted` and `--accent` against `--bg` and `--surface`.

## What's a placeholder

The five NJORD before/after screenshot pairs, the Laerdal hero, the Crypho before/after, and the Plant-O-Meter hero are all real images pulled from the source case-study PDFs. The portrait is cropped from the existing site's screenshot. If you get cleaner source files later (higher-res exports, a proper headshot), just swap the files in `assets/img/`; the `<img>` tags don't need to change beyond their `width`/`height` attributes.
