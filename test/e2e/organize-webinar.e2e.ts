import { WebinarRepository } from '@/domain/webinars';
import { addDays } from 'date-fns';
import * as request from 'supertest';
import { AppTest } from '../app-test';
import { e2eUsers } from '../seeders/user.seeds';

describe('Feature: Organizing a webinar', () => {
  let app: AppTest;
  let webinarRepository: WebinarRepository;
  const start = addDays(new Date(), 4);
  const end = addDays(new Date(), 5);
  const payload = {
    title: 'My first webinar',
    seats: 100,
    start: start.toISOString(),
    end: end.toISOString(),
  };

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe]);

    webinarRepository = app.get(WebinarRepository);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should create the webinar', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({
          ...payload,
          end: end.toISOString(),
          start: start.toISOString(),
        });

      expect(result.status).toBe(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinar = await webinarRepository.findById(result.body.id);

      expect(webinar).toBeDefined();
      expect(webinar!.props).toEqual({
        ...payload,
        id: result.body.id,
        start,
        end,
        organizerId: 'john-doe',
      });
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .send({
          ...payload,
          end: end.toISOString(),
          start: start.toISOString(),
        });

      expect(result.status).toBe(403);
    });
  });
});
