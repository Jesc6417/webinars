import { Webinar } from '@/domain/webinars';
import { addDays } from 'date-fns';
import * as request from 'supertest';
import { AppTest } from '../app-test';
import { e2eUsers, e2eWebinars } from '../seeders';

describe('Feature: Changing the dates', () => {
  let app: AppTest<Webinar>;

  beforeEach(async () => {
    app = new AppTest(Webinar);
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, e2eWebinars.sampleWebinar]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Happy path', () => {
    it('should succeed', async () => {
      const start = addDays(new Date(), 8);
      const end = addDays(new Date(), 9);
      const result = await request(app.getHttpServer())
        .post(
          `${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}/change-dates`,
        )
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({
          start,
          end,
        });

      expect(result.status).toBe(200);

      const webinar = await e2eWebinars.sampleWebinar.getById(app);

      expect(webinar!.props.start).toEqual(start);
      expect(webinar!.props.end).toEqual(end);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post(
          `${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}/change-dates`,
        )
        .send({
          start: addDays(new Date(), 8),
          end: addDays(new Date(), 9),
        });

      expect(result.status).toBe(403);
    });
  });
});
