import { User } from './../entities/user';
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
  const johnDoe = new User({
    email: 'john-doe@gmail.com',
    token,
    id: 'id-1',
  });

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    authenticateUser = new AuthenticateUser(userRepository);
  });

  describe('Scenario: Happy path', () => {
    it('should authenticate the user', async () => {
      userRepository.database.push(johnDoe);

      const result = await authenticateUser.execute(payload);

      expect(result).toEqual({
        access_token: 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==',
      });
    });
  });

  describe('Scenario: the user does not exist', () => {
    it('should fail', async () => {
      expect(
        async () => await authenticateUser.execute(payload),
      ).rejects.toThrow('User not found.');
    });
  });

  describe('Scenario: the password is not valid', () => {
    it('should fail', async () => {
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
