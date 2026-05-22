# Pages

Only the `<main>...</main>` block (no header/footer). Layout: `view/layout.ejs`.

## Folders

| Folder | Purpose | HTML source (migrate when needed) |
|--------|---------|-----------------------------------|
| `site/` | Public landing | `home.html`, `home-2.html` … |
| `auth/` | Login / OTP verify (live) | `login.ejs`, `verify.ejs` |
| `profile/` | User panel | `profile*.html` |
| `course/` | Courses catalog & detail | `course-*.html` |
| `blog/` | Blog & articles | `blog.html`, `article-*.html` |
| `shop/` | Cart & checkout | `cart.html`, `cart-empty.html` |
| `legal/` | Terms, FAQ | `terms.html`, `faq.html` |
| `content/` | Static pages | `about-us.html`, `contact-us.html`, `lecturer.html`, `series.html` |
| `errors/` | HTTP error bodies | `404.html` |

## Render path

Nest `@Render` uses the path under `src/common/view/`:

```typescript
@Render('view/pages/site/home')
@Render('view/pages/errors/not-found')
```

Module-specific pages stay in `src/modules/<name>/view/`.
