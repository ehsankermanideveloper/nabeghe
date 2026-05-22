# Views (EJS)

## Layout

All MVC pages use `view/layout.ejs` via [express-ejs-layouts](https://github.com/mde/ejs-locals) (default in `bootstrap.ts`).

- `partials/header.ejs` — site header
- `partials/footer.ejs` — site footer
- `pages/` — page bodies grouped by domain (see `pages/README.md`)
- Module pages: `src/modules/<name>/view/`

## Static assets

CSS/JS/images: `html/assets/` → `/assets/`

## Quick reference

| Template | Route |
|----------|-------|
| `pages/site/home.ejs` | `GET /` |
| `pages/errors/not-found.ejs` | 404 |
| `pages/errors/error.ejs` | other HTML errors |

Disable layout: pass `layout: false` in render locals.
