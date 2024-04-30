import { UserSeeds } from './../tests/user.seeds';
import { InMemoryUserRepository } from '../adapters';
import { AuthenticateUser } from './authenticate-user';

describe('Feature: Authenticate user', () => {
  let userRepository: InMemoryUserRepository;
  let authenticateUser: AuthenticateUser;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    authenticateUser = new AuthenticateUser(userRepository);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      email: 'alice@gmail.com',
      password: 'azerty',
    };

    it('should authenticate the user', async () => {
      userRepository.database.push(UserSeeds.alice);

      const result = await authenticateUser.execute(payload);

      expect(result).toEqual({
        access_token: UserSeeds.token,
      });
    });
  });

  describe('Scenario: the user does not exist', () => {
    const payload = {
      email: 'alice@gmail.com',
      password: 'azerty',
    };

    it('should fail', async () => {
      expect(
        async () => await authenticateUser.execute(payload),
      ).rejects.toThrow('User not found.');
    });
  });

  describe('Scenario: the password is not valid', () => {
    const payload = {
      email: 'alice@gmail.com',
      password: 'not-valid-password',
    };

    it('should fail', async () => {
      expect(
        async () => await authenticateUser.execute(payload),
      ).rejects.toThrow('User not found.');
    });
  });
});
