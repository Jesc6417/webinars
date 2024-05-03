import { Webinar } from '@/domain/webinars';
import { AppTest } from '../app-test';
import * as request from 'supertest';
import { e2eUsers, e2eWebinars } from '../seeders';

describe('Feature: Cancelling webinar', () => {
  let app: AppTest<Webinar>;

  beforeEach(async () => {
    app = new AppTest(Webinar);
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, e2eWebinars.sampleWebinar]);
  });

  describe('Scenario: Happy path', () => {
    it('should succedd', async () => {
      const result = await request(app.getHttpServer())
        .delete(`${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}`)
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
        .delete(`${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .send();

      expect(result.status).toBe(403);
    });
  });
});
