import { Webinar } from '@/domain/webinars';
import * as request from 'supertest';
import { AppTest } from '../app-test';
import { e2eUsers, e2eWebinars } from '../seeders';

describe('Feature: Changing number of seats', () => {
  let app: AppTest<Webinar>;
  const seats = 150;

  beforeEach(async () => {
    app = new AppTest(Webinar);
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, e2eWebinars.sampleWebinar]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const result = await request(app.getHttpServer())
        .post(
          `${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}/change-seats`,
        )
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({
          seats,
        });

      expect(result.status).toBe(200);

      const webinar = await e2eWebinars.sampleWebinar.getById(app);

      expect(webinar!.props.seats).toEqual(seats);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post(
          `${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}/change-seats`,
        )
        .send({
          seats,
        });

      expect(result.status).toBe(403);
    });
  });
});
