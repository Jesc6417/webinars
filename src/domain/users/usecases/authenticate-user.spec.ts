import { InMemoryUserRepository } from '../adapters';
import { AuthenticateUser } from './authenticate-user';

describe('Feature: Authenticate user', () => {
  let userRepository: InMemoryUserRepository;
  let authenticateUser: AuthenticateUser;
  const payload = {
    email: 'john-doe@gmail.com',
    password: 'azerty',
  };
  const token = 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==';

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    authenticateUser = new AuthenticateUser(userRepository);
  });

  describe('Scenario: Happy path', () => {
    it('should authenticate the user', async () => {
      userRepository.database.push(token);

      const response = await authenticateUser.execute(payload);

      expect(response).toEqual({ authenticated: true });
    });
  });

  describe('Scenario: the user does not exist', () => {
    it('should fail', async () => {
      const authenticator = new InMemoryUserRepository();
      const authenticateUser = new AuthenticateUser(authenticator);

      expect(
        async () => await authenticateUser.execute(payload),
      ).rejects.toThrow('User not found.');
    });
  });

  describe('Scenario: the password is not valid', () => {
    it('should fail', async () => {
      const authenticator = new InMemoryUserRepository();
      const authenticateUser = new AuthenticateUser(authenticator);

      expect(
        async () =>
          await authenticateUser.execute({
            ...payload,
            password: 'not-valid-password',
          }),
      ).rejects.toThrow('User not found.');
    });
  });
});
