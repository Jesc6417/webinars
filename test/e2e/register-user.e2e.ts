import { AppTest } from '../app-test';
import * as request from 'supertest';

describe('Feature: Register User', () => {
  let app: AppTest;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const result = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          email: 'lea@gmail.com',
          password: 'azerty',
        });

      expect(result.status).toBe(201);
    });
  });
});
