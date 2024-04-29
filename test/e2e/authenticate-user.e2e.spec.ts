import { UserRepository, InMemoryUserRepository } from '@/domain/users';
import { User } from '@/domain/users/entities/user';
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
  const johnDoe = new User({
    email: 'john-doe@gmail.com',
    token,
    id: 'id-1',
  });

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    userRepository = app.get(UserRepository);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  it('Scenario: Happy path', async () => {
    userRepository.database.push(johnDoe);

    const result = await request(app.getHttpServer())
      .post('/users/authenticate')
      .send(payload);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ access_token: token });
  });
});
