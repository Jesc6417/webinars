import { User } from '@/domain/users/entities/user';
import * as request from 'supertest';
import { AppTest } from '../app-test';
import { UserFixture } from '../fixtures/user.fixture';
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

  it('Scenario: Happy path', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/authenticate')
      .send(payload);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ access_token: e2eUsers.johnDoe.getToken() });
  });
});
