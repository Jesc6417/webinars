import { StubUserBuilder } from './../entities/user.builder';
import { InMemoryUserRepository } from './../adapters';
import { ValidateUserToken } from './validate-user-token';

describe('Feature: Validate user token', () => {
  let userRepository: InMemoryUserRepository;
  let validateUserToken: ValidateUserToken;
  const alice = new StubUserBuilder().build();

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    validateUserToken = new ValidateUserToken(userRepository);

    await userRepository.create(alice);
  });

  describe('Scenario: Happy path', () => {
    it('should return true if the token is valid', async () => {
      const result = await validateUserToken.execute({
        token: alice.props.token,
      });

      expect(result).toBeDefined();
      expect(result!.props).toEqual(alice.props);
    });
  });

  describe('Scenario: token not found', () => {
    it('should fail', async () => {
      expect(
        async () =>
          await validateUserToken.execute({
            token: 'YWxpY2VAZ21haWwuY29tOmF6ZXJ0eQ=',
          }),
      ).rejects.toThrow('Invalid token.');
    });
  });
});
