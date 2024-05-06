import { User } from '@/domain/users';
import { MongoUser, MongoUserRepository } from './../users';
import { getModelToken } from '@nestjs/mongoose';
import { MongoParticipant } from './mongo-participant';
import { MongoParticipantRepository } from './mongo-participant.repository';
import { Model } from 'mongoose';
import { AppTest } from '../../../../test/app-test';

const user = new User({
  id: '1',
  email: 'martin@gmail.com',
  token: 'token',
});

describe('MongoParticipantRepository', () => {
  let app: AppTest;
  let model: Model<MongoParticipant.SchemaClass>;
  let repository: MongoParticipantRepository;
  let userModel: Model<MongoUser.SchemaClass>;
  let userRepository: MongoUserRepository;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    model = await app.get(getModelToken(MongoParticipant.collection));
    userModel = await app.get(getModelToken(MongoUser.collection));

    repository = new MongoParticipantRepository(model);
    userRepository = new MongoUserRepository(userModel);

    await userRepository.create(user);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Get participant email by id', () => {
    it('should return the participant email', async () => {
      const participant = await repository.getEmailById(user.props.id);

      expect(participant).toEqual(user.props.email);
    });
  });
});
