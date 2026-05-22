import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { join } from 'path';
import { AppModule } from '../src/app.module';

describe('HTTP (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.setBaseViewsDir(join(__dirname, '../src/modules'));
    app.setViewEngine('ejs');
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('GET /health', () =>
    request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ ok: true }));

  it('GET /demo renders HTML list', async () =>
    request(app.getHttpServer())
      .get('/demo')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('EJS');
      }));
});
