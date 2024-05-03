import { Participation } from '@/domain/webinars';
import * as request from 'supertest';
import { AppTest } from '../app-test';
import {
  e2eParticipations,
  e2eUsers,
  e2eWebinars,
  e2eParticipants,
} from '../seeders';

describe('Feature: Reserving seat', () => {
  let app: AppTest<Participation>;

  beforeEach(async () => {
    app = new AppTest(Participation);
    await app.setup();
    await app.loadFixtures([
      e2eUsers.johnDoe,
      e2eWebinars.sampleWebinar,
      e2eParticipants.bob,
    ]);
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const result = await request(app.getHttpServer())
        .post(`${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({
          webinarId: e2eWebinars.sampleWebinar.entity.props.id,
        });

      expect(result.status).toBe(201);

      const participations =
        await e2eParticipations.existingParticipation.getById(app);

      expect(participations.length).toBe(1);
      expect(participations[0]).toBe(e2eParticipants.bob.entity.props.id);
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post(`${app.path}/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .send({
          webinarId: e2eWebinars.sampleWebinar.entity.props.id,
        });

      expect(result.status).toBe(403);
    });
  });
});
