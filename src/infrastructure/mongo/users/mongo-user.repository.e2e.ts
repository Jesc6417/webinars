import { User } from '@/domain/users';
import { MongoUser } from '@/infrastructure/mongo/users/mongo-user';
import { MongoUserRepository } from '@/infrastructure/mongo/users/mongo-user.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppTest } from '../../../../test/app-test';

describe('MongoUserRepository', () => {
  let app: AppTest;
  let model: Model<MongoUser.SchemaClass>;
  let repository: MongoUserRepository;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    model = app.get<Model<MongoUser.SchemaClass>>(
      getModelToken(MongoUser.collection),
    );
    repository = new MongoUserRepository(model);

    const record = new model({
      _id: '1',
      email: 'alice@gmail.com',
      token: 'YWxpY2VAZ21haWwuY29tOjEyMzQ1Ng==',
    });

    await record.save();
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Authenticate the user', () => {
    it('should authenticate the user', async () => {
      const token = await repository.authenticate(
        'YWxpY2VAZ21haWwuY29tOjEyMzQ1Ng==',
      );

      expect(token).toBe(true);
    });

    it('should not authenticate the user', async () => {
      const token = await repository.authenticate(
        'YWxpY2VAZ21haWwuY29tOmF6ZXJ0eQ==',
      );

      expect(token).toBe(false);
    });
  });

  describe('Validate the user', () => {
    it('should validate the user', async () => {
      const user = await repository.validate(
        'YWxpY2VAZ21haWwuY29tOjEyMzQ1Ng==',
      );

      expect(user!.props).toEqual({
        id: '1',
        email: 'alice@gmail.com',
        token: 'YWxpY2VAZ21haWwuY29tOjEyMzQ1Ng==',
      });
    });

    it('should not authenticate the user', async () => {
      const user = await repository.validate(
        'YWxpY2VAZ21haWwuY29tOmF6ZXJ0eQ==',
      );

      expect(user).toBeUndefined();
    });
  });

  describe('Create user', () => {
    it('should create the user', async () => {
      await repository.create(
        new User({
          id: '2',
          email: 'bob@gmail.com',
          token: 'Ym9iQGdtYWlsLmNvbTphemVydHk=',
        }),
      );

      const record = await model.findById('2');

      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: '2',
        email: 'bob@gmail.com',
        token: 'Ym9iQGdtYWlsLmNvbTphemVydHk=',
      });
    });
  });
});
