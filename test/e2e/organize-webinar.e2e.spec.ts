import { WebinarRepository } from '@/domain/webinars';
import { addDays } from 'date-fns';
import * as request from 'supertest';
import { AppTest } from '../app-test';

describe('Organizing a webinar', () => {
  let app: AppTest;
  let webinarRepository: WebinarRepository;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    webinarRepository = app.get(WebinarRepository);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  it('Scenario: happy path', async () => {
    const start = addDays(new Date(), 4);
    const end = addDays(new Date(), 5);

    const result = await request(app.getHttpServer())
      .post('/webinars')
      .send({
        title: 'My first webinar',
        seats: 100,
        start: start.toISOString(),
        end: end.toISOString(),
        user: {
          id: 'john-doe',
        },
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
      organizerId: 'john-doe',
    });
  });
});
