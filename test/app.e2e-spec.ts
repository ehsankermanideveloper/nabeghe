import { Test, TestingModule } from '@nestjs/testing';
import { TypedConfigService } from '../src/common/config/typed-config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import expressLayouts from 'express-ejs-layouts';
import request from 'supertest';
import { join } from 'path';
import { loadEnvFiles } from '../src/config/load-env';
import { configureSession } from '../src/modules/auth/session/configure-session';
import { AppModule } from '../src/app.module';

function extractCsrf(html: string): string {
  const match = html.match(/name="_csrf" value="([^"]+)"/);
  return match?.[1] ?? '';
}

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
    await configureSession(app, app.get(TypedConfigService));
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
        expect(res.text).toContain('لیان امیری');
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
        expect(res.text).toContain('لیان امیری');
        expect(res.text).toContain('TypeORM');
      }));

  it('GET /api/categories/menu returns tree', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/categories/menu')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', /max-age=\d+/);

    const body = res.body as {
      data: { title: string; children: { title: string }[] }[];
    };
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].children.length).toBeGreaterThan(0);
  });

  it('auth flow: login with OTP 252525 then access profile', async () => {
    const agent = request.agent(app.getHttpServer());

    const loginPage = await agent.get('/auth/login').expect(200);
    const csrfLogin = extractCsrf(loginPage.text);

    await agent
      .post('/auth/login')
      .type('form')
      .send({ identifier: '09121234567', _csrf: csrfLogin })
      .expect(302);

    const verifyPage = await agent.get('/auth/verify').expect(200);
    const csrfVerify = extractCsrf(verifyPage.text);

    await agent
      .post('/auth/verify')
      .type('form')
      .send({ code: '252525', _csrf: csrfVerify })
      .expect(302);

    await agent
      .get('/profile')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('پنل کاربری');
      });
  });
});
