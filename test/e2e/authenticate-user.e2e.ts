import * as request from 'supertest';
import { AppTest } from '../app-test';
import { e2eUsers } from '../seeders/user.seeds';

describe('Authenticate User', () => {
  let app: AppTest;
  const payload = {
    email: 'john-doe@gmail.com',
    password: 'azerty',
  };

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const result = await request(app.getHttpServer())
        .post('/users/authenticate')
        .send(payload);

      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        access_token: e2eUsers.johnDoe.getToken(),
      });
    });
  });
});
