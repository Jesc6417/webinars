import { RegisterUser, RegisterUserCommand } from './register-user';
import { FixedIdProvider } from './../../../core';
import { InMemoryUserRepository } from './../adapters';
import { StubUserBuilder } from './../entities/user.builder';

describe('Feature: Register user', () => {
  let userRepository: InMemoryUserRepository;
  let idProvider: FixedIdProvider;
  let registerUser: RegisterUser;
  const newUser = new StubUserBuilder().build();

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    idProvider = new FixedIdProvider();
    registerUser = new RegisterUser(userRepository, idProvider);
  });

  describe('Scenario: Happy path', () => {
    it('should create the user', async () => {
      await registerUser.execute(
        new RegisterUserCommand(newUser.props.email, 'azerty'),
      );

      const user = userRepository.database[0];

      expect(user.props).toEqual({
        id: 'id-1',
        email: newUser.props.email,
        token: newUser.props.token,
      });
    });
  });
});
