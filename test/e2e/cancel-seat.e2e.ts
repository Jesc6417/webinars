import { Participation } from '@/domain/webinars';
import * as request from 'supertest';
import { AppTest } from '../app-test';
import {
  e2eParticipants,
  e2eParticipations,
  e2eUsers,
  e2eWebinars,
} from '../seeders';

describe('Feature: Canceling seat', () => {
  let app: AppTest<Participation>;

  beforeEach(async () => {
    app = new AppTest(Participation);
    await app.setup();
    await app.loadFixtures([
      e2eUsers.johnDoe,
      e2eParticipations.existingParticipation,
      e2eWebinars.sampleWebinar,
      e2eParticipants.bob,
    ]);
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const result = await request(app.getHttpServer())
        .delete(`${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({
          webinarId:
            e2eParticipations.existingParticipation.entity.props.webinarId,
        });

      expect(result.status).toBe(200);

      const participations =
        await e2eParticipations.existingParticipation.getById(app);

      expect(participations.length).toBe(0);
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .delete(`${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .send({
          webinarId:
            e2eParticipations.existingParticipation.entity.props.webinarId,
        });

      expect(result.status).toBe(403);
    });
  });
});
