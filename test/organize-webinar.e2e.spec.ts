import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Organizing a webinar', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Scenario: happy path', async () => {
    return await request(app.getHttpServer())
      .post('/webinars')
      .send({
        title: 'My first webinar',
        seats: 100,
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      })
      .expect(201);
  });
});
