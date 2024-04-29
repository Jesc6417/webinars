import { UserRepository, InMemoryUserRepository } from '@/domain/users';
import * as request from 'supertest';
import { AppTest } from '../app-test';

describe('Authenticate User', () => {
  let app: AppTest;
  let userRepository: InMemoryUserRepository;
  const payload = {
    email: 'john-doe@gmail.com',
    password: 'azerty',
  };
  const token = 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==';

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    userRepository = app.get(UserRepository);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  it('Scenario: Happy path', async () => {
    userRepository.database.push(token);

    const result = await request(app.getHttpServer())
      .post('/users/authenticate')
      .send(payload);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ authenticated: true });
  });
});
