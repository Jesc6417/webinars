import { WebinarQueryStore } from '@/domain/webinars';
import { AppTest } from '../../app-test';
import * as request from 'supertest';
import { e2eParticipations, e2eUsers, e2eWebinars } from '../../seeders';

describe('Get webinar by id', () => {
  let app: AppTest;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    await app.loadFixtures([
      e2eUsers.johnDoe,
      e2eWebinars.sampleWebinar,
      e2eParticipations.existingParticipations,
    ]);

    const webinarQueryStore: WebinarQueryStore = app.get(WebinarQueryStore);
    await webinarQueryStore.storeWebinarById(
      e2eWebinars.sampleWebinar.entity.props.id,
      {
        id: e2eWebinars.sampleWebinar.entity.props.id,
        title: e2eWebinars.sampleWebinar.entity.props.title,
        start: e2eWebinars.sampleWebinar.entity.props.start,
        end: e2eWebinars.sampleWebinar.entity.props.end,
        organizer: {
          id: e2eUsers.johnDoe.entity.props.id,
          email: e2eUsers.johnDoe.entity.props.email,
        },
        seats: {
          reserved: 0,
          available: e2eWebinars.sampleWebinar.entity.props.seats,
        },
      },
    );
  });

  describe('Scenario: Get webinar given an id', () => {
    it('should succeed', async () => {
      const result = await request(app.getHttpServer())
        .get(`/webinars/${e2eWebinars.sampleWebinar.entity.props.id}`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send();

      expect(result.status).toBe(200);
    });
  });
});
