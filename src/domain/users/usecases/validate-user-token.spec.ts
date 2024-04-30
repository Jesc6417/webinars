import { UserSeeds } from './../tests/user.seeds';
import { InMemoryUserRepository } from './../adapters';
import { ValidateUserToken } from './validate-user-token';

describe('Feature: Validate user token', () => {
  let userRepository: InMemoryUserRepository;
  let validateUserToken: ValidateUserToken;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    validateUserToken = new ValidateUserToken(userRepository);
  });

  describe('Scenario: Happy path', () => {
    it('should return true if the token is valid', async () => {
      userRepository.database.push(UserSeeds.alice);

      const result = await validateUserToken.execute(UserSeeds.token);

      expect(result).toBeDefined();
      expect(result!.props).toEqual({
        email: 'alice@gmail.com',
        id: 'id-alice',
        token: 'YWxpY2VAZ21haWwuY29tOmF6ZXJ0eQ==',
      });
    });
  });

  describe('Scenario: token not found', () => {
    it('should fail', async () => {
      expect(
        async () => await validateUserToken.execute(UserSeeds.token),
      ).rejects.toThrow('Invalid token.');
    });
  });
});
