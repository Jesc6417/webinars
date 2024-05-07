import { FixedIdProvider, IdProvider } from './../../core';
import { InMemoryUserRepository } from './../adapters';
import { StubUserBuilder } from './../entities/user.builder';
import { RegisterUser } from './../usecases/register-user';

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
      await registerUser.execute({
        email: newUser.props.email,
        password: 'azerty',
      });

      const user = userRepository.database[0];

      expect(user.props).toEqual({
        id: 'id-1',
        email: newUser.props.email,
        token: newUser.props.token,
      });
    });
  });
});
