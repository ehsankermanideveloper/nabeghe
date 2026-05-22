# TypedConfigService

Global wrapper around Nest `ConfigService` with typed getters: `app`, `database`, `cache`, `logger`, `auth`.

Inject `TypedConfigService` instead of calling `configService.getOrThrow('…')` in application code.

Config values still originate from `src/config/*.config.ts` factories registered in `ConfigModule.forRoot({ load: [...] })`.
