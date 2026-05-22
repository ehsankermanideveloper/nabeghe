import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { join } from 'path';
import { loadEnvFiles } from '../src/config/load-env';
import { AppModule } from '../src/app.module';

describe('HTTP (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    loadEnvFiles();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    const httpServer = app.getHttpAdapter().getInstance();
    httpServer.set('views', [
      join(__dirname, '../src/modules'),
      join(__dirname, '../src/common'),
    ]);
    httpServer.set('view engine', 'ejs');
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

  it('GET /demo renders HTML list', async () =>
    request(app.getHttpServer())
      .get('/demo')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('EJS');
      }));
});
