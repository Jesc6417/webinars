import { WebinarRepository } from '@/domain/webinars';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { addDays } from 'date-fns';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Organizing a webinar', () => {
  let app: INestApplication;
  let webinarRepository: WebinarRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    webinarRepository = app.get(WebinarRepository);
  });

  it('Scenario: happy path', async () => {
    const start = addDays(new Date(), 4);
    const end = addDays(new Date(), 5);

    const result = await request(app.getHttpServer()).post('/webinars').send({
      title: 'My first webinar',
      seats: 100,
      start: start.toISOString(),
      end: end.toISOString(),
    });

    expect(result.status).toBe(201);
    expect(result.body).toEqual({ id: expect.any(String) });

    const webinar = await webinarRepository.findById(result.body.id);

    expect(webinar).toBeDefined();
    expect(webinar!.props).toEqual({
      id: result.body.id,
      title: 'My first webinar',
      seats: 100,
      start,
      end,
    });
  });
});
