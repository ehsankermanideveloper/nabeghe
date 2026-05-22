# TypeORM datasource & migrations

The Nest app configures TypeORM in `src/database/typeorm-root.options.ts` (PostgreSQL except `NODE_ENV=test`).

The CLI uses the same Postgres settings from **`DataSource`** in `src/database/typeorm.data-source.ts` after a build (so entity metadata comes from **`dist/**/*.entity.js`**).

## Commands:

- **Fresh empty migration stub**  
  `name=my-change pnpm run migration:create`

- **Diff DB vs compiled entities → SQL migration**  
  `name=my-change pnpm run migration:generate`

  (`name` can also be passed after `--`: `pnpm run migration:generate -- my-change`)

- **Apply pending migrations**  
  `pnpm run migration:run`

- **Revert last batch**  
  `pnpm run migration:revert`

- **Show status**  
  `pnpm run migration:show`

## Notes

1. Postgres must match `.env` / `.env.local` before CLI commands (`DATABASE_*`).
2. Set **`DATABASE_SYNC=false`** once you rely on migrations (recommended for anything beyond quick local tinkering).
3. Primary keys are auto-increment integers (`SERIAL` in the initial migration).
