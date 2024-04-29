import { extractToken } from './extract-token';

describe('Extract token', () => {
  describe('Scenario: Happy path', () => {
    it('should extract the token from the authorization header', () => {
      const authorizationHeader = 'Basic azerty';

      const token = extractToken(authorizationHeader);

      expect(token).toBe('azerty');
    });
  });

  describe('Scenario: header authorization with wrong format', () => {
    it('should fail as there is more than 2 parts', async () => {
      const authorizationHeader = 'Basic more than two parts';

      expect(async () => extractToken(authorizationHeader)).rejects.toThrow(
        'Invalid token',
      );
    });

    it('should fail as header authorization do not start by Basic', async () => {
      const authorizationHeader = 'Test azerty';

      expect(async () => extractToken(authorizationHeader)).rejects.toThrow(
        'Invalid token',
      );
    });
  });
});
