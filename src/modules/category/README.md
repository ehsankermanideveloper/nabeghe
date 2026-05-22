# Category module

Tree structure: **branch** (root, `parent_id = null`) → **leaf** (max depth 2).

## API

`GET /api/categories/menu` — public JSON for header menus.

```json
{
  "data": [
    {
      "id": 1,
      "title": "برنامه نویسی وب",
      "slug": "web-development",
      "href": "/courses/category/web-development",
      "children": [{ "id": 2, "title": "جاوااسکریپت", "slug": "javascript", "href": "...", "children": [] }]
    }
  ]
}
```

## Seed

On app start (non-production), if the table is empty, `CategorySeedService` inserts sample data from `seed/category.seed-data.ts`.

## Frontend

`src/common/view/assets/js/category-menu.js` — یک `Alpine.store` مشترک؛ فقط **یک** درخواست به API (دسکتاپ + موبایل همان داده را می‌خوانند).

Run migration: `pnpm run migration:run`
