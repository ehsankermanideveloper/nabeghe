# Domain modules (`src/modules`)

Nest domain modules typically follow this layout:

```
src/modules/<slug>/
  <slug>.module.ts
  controller/
  service/
  entity/
  repository/
  dto/
  view/*.ejs
```

Templates: `@Render('<slug>/view/<name>')` (no `.ejs`).

Example **`demo`** at **`GET /demo`**.

Path aliases:

- `import { BaseEntity } from '@common/entity/base.entity';`
- `import { DemoService } from '@modules/demo/service/demo.service';`
- `import { AppCacheService } from '@common/cache/cache.service';`

`NODE_ENV=test` (jest e2e) uses sql.js in memory; otherwise configure PostgreSQL via `.env` (`DATABASE_*`). Cache defaults to in-memory (`CACHE_STORE=memory`).
