import * as request from 'supertest';
import { AppTest } from '../app-test';
import { e2eUsers } from '../seeders/user.seeds';
import { e2eWebinars } from '../seeders/webinar.seeds';

describe('Feature: Change seats', () => {
  let app: AppTest;
  const seats = 150;
  const id = 'id-1';

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, e2eWebinars.sampleWebinar]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should create the webinar', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinars/${id}/change-seats`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({
          seats,
        });

      expect(result.status).toBe(200);

      const webinar = await e2eWebinars.sampleWebinar.get(app);

      expect(webinar!.props.seats).toEqual(seats);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinars/${id}/change-seats`)
        .send({
          seats,
        });

      expect(result.status).toBe(403);
    });
  });
});
