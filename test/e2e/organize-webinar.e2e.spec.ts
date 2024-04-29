import { extractToken } from '@/domain/core';
import { InMemoryUserRepository, UserRepository } from '@/domain/users';
import { WebinarRepository } from '@/domain/webinars';
import { addDays } from 'date-fns';
import * as request from 'supertest';
import { AppTest } from '../app-test';

xdescribe('Organizing a webinar', () => {
  let app: AppTest;
  let webinarRepository: WebinarRepository;
  let userRepository: InMemoryUserRepository;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    webinarRepository = app.get(WebinarRepository);
    userRepository = app.get(UserRepository);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should create the webinar', async () => {
      const start = addDays(new Date(), 4);
      const end = addDays(new Date(), 5);
      const token = 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==';

      userRepository.database.push(token);

      const result = await request(app.getHttpServer())
        .post('/webinars')
        .set('Authorization', `Basic ${token}`)
        .send({
          title: 'My first webinar',
          seats: 100,
          start: start.toISOString(),
          end: end.toISOString(),
          user: {
            id: 'john-doe',
          },
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
        organizerId: 'john-doe',
      });
    });
  });
});
