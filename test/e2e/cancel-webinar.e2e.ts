import { AppTest } from '../app-test';
import * as request from 'supertest';
import { e2eUsers } from '../seeders/user.seeds';
import { e2eWebinars } from '../seeders/webinar.seeds';

describe('Feature: Cancelling webinar', () => {
  let app: AppTest;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, e2eWebinars.sampleWebinar]);
  });

  describe('Scenario: Happy path', () => {
    it('should succedd', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/webinars/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send();

      expect(result.status).toBe(200);

      const webinar = await e2eWebinars.sampleWebinar.getById(app);
      expect(webinar).toBeNull();
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should fail', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/webinars/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .send();

      expect(result.status).toBe(403);
    });
  });
});
