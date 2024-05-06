import { User } from '@/domain/users';
import { MongoUser, MongoUserRepository } from '@/infrastructure/mongo';
import { getModelToken } from '@nestjs/mongoose';
import { MongoOrganizer } from './mongo-organizer';
import { MongoOrganizerRepository } from './mongo-organizer.repository';
import { Model } from 'mongoose';
import { AppTest } from '../../../../test/app-test';

const user = new User({
  id: '1',
  email: 'eliott@gmail.com',
  token: 'token',
});

describe('MongoOrganizerRepository', () => {
  let app: AppTest;
  let repository: MongoOrganizerRepository;
  let userRepositoy: MongoUserRepository;
  let model: Model<MongoOrganizer.SchemaClass>;
  let userModel: Model<MongoUser.SchemaClass>;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();
    model = app.get(getModelToken(MongoOrganizer.collection));
    userModel = app.get(getModelToken(MongoUser.collection));

    repository = new MongoOrganizerRepository(model);
    userRepositoy = new MongoUserRepository(userModel);

    await userRepositoy.create(user);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Get organizer email', () => {
    it('should succeed', async () => {
      const organizer = await repository.findEmail(user.props.id);

      expect(organizer).toBe(user.props.email);
    });
  });
});
