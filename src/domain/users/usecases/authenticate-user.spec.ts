import { InMemoryUserRepository } from '../adapters/in-memory-user-repository';
import { AuthenticateUser } from './authenticate-user';

describe('Feature: Authenticate user', () => {
  describe('Scenario: Authentication', () => {
    for (const iteration of [
      {
        title: 'should return true',
        token: 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==',
        existingToken: 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==',
        expected: { authenticated: true },
      },
      {
        title: 'should return false',
        token: 'am9obi1kb2VAZ21haWwuY29tOjEyMzQ1Ng==',
        existingToken: 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==',
        expected: { authenticated: false },
      },
      {
        title: 'should return false',
        token: 'am9obi1kb2VAZ21haWwuY29tOjEyMzQ1Ng==',
        existingToken: null,
        expected: { authenticated: false },
      },
    ]) {
      it(iteration.title, async () => {
        const authenticator = new InMemoryUserRepository();
        const authenticateUser = new AuthenticateUser(authenticator);

        if (iteration.existingToken)
          authenticator.database.push(iteration.existingToken);

        const response = await authenticateUser.execute(iteration.token);

        expect(response).toEqual(iteration.expected);
      });
    }
  });
});
