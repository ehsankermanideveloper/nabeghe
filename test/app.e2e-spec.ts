import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import expressLayouts from 'express-ejs-layouts';
import request from 'supertest';
import { join } from 'path';
import { loadEnvFiles } from '../src/config/load-env';
import { AppModule } from '../src/app.module';

function configureViews(app: NestExpressApplication): void {
  const httpServer = app.getHttpAdapter().getInstance();
  httpServer.use(expressLayouts);
  httpServer.set('layout', 'view/layout');
  httpServer.set('views', [
    join(__dirname, '../src/modules'),
    join(__dirname, '../src/common'),
  ]);
  httpServer.set('view engine', 'ejs');
}

describe('HTTP (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    loadEnvFiles();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    configureViews(app);
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('GET /health/live', () =>
    request(app.getHttpServer())
      .get('/health/live')
      .expect(200)
      .expect({ status: 'ok' }));

  it('GET /health/ready', () =>
    request(app.getHttpServer())
      .get('/health/ready')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          status: string;
          checks: { database: { status: string } };
        };
        expect(body.status).toBe('ok');
        expect(body.checks.database.status).toBe('up');
      }));

  it('GET / renders home with layout header', () =>
    request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('نـــابــــغه');
      }));

  it('GET /unknown-route returns 404 page', () =>
    request(app.getHttpServer())
      .get('/unknown-route')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('چنین صفحه');
      }));

  it('GET /demo renders with layout', async () =>
    request(app.getHttpServer())
      .get('/demo')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('نـــابــــغه');
        expect(res.text).toContain('TypeORM');
      }));
});
