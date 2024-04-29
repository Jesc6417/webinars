import { InMemoryUserRepository } from './../adapters';
import { ValidateUserToken } from './validate-user-token';

describe('Usecase: Validate user token', () => {
  let userRepository: InMemoryUserRepository;
  let validateUserToken: ValidateUserToken;
  const token = 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==';

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    validateUserToken = new ValidateUserToken(userRepository);
  });

  describe('Scenario: Happy path', () => {
    it('should return true if the token is valid', async () => {
      userRepository.database.push(token);

      const result = await validateUserToken.execute(token);

      expect(result).toBe(true);
    });
  });

  describe('Scenario: token not found', () => {
    it('should fail', async () => {
      expect(
        async () => await validateUserToken.execute(token),
      ).rejects.toThrow('Invalid token.');
    });
  });
});
