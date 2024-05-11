import { WebinarQueryStore, WebinarRepository } from '@/domain/webinars';
import { addDays } from 'date-fns';
import * as request from 'supertest';
import { AppTest } from '../app-test';
import { e2eUsers } from '../seeders/user.seeds';

describe('Feature: Organizing a webinar', () => {
  let app: AppTest;
  let webinarRepository: WebinarRepository;
  let webinarQueryStore: WebinarQueryStore;
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
    webinarQueryStore = app.get(WebinarQueryStore);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
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
        id: result.body.id,
        title: 'My first webinar',
        seats: 100,
        start,
        end,
        organizerId: 'id-user-1',
      });

      const storedWebinar = await webinarQueryStore.getWebinarById(
        result.body.id,
      );

      expect(storedWebinar).toEqual({
        id: result.body.id,
        title: 'My first webinar',
        start,
        end,
        organizer: {
          id: 'id-user-1',
          email: 'john-doe@gmail.com',
        },
        seats: {
          reserved: 0,
          available: 100,
        },
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
