import { StubUserBuilder } from './../entities/user.builder';
import { InMemoryUserRepository } from '../adapters';
import { AuthenticateUser } from './authenticate-user';

describe('Feature: Authenticate user', () => {
  let userRepository: InMemoryUserRepository;
  let authenticateUser: AuthenticateUser;
  const alice = new StubUserBuilder().build();

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    authenticateUser = new AuthenticateUser(userRepository);

    await userRepository.create(alice);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      email: 'alice@gmail.com',
      password: 'azerty',
    };

    it('should authenticate the user', async () => {
      const result = await authenticateUser.execute(payload);

      expect(result).toEqual({
        access_token: alice.props.token,
      });
    });
  });

  describe('Scenario: the user does not exist', () => {
    const payload = {
      email: 'unknown-user@gmail.com',
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
      password: 'not-vwalid-password',
    };

    it('should fail', async () => {
      expect(
        async () => await authenticateUser.execute(payload),
      ).rejects.toThrow('User not found.');
    });
  });
});
