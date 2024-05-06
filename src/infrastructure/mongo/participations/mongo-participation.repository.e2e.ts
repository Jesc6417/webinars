import { Participation } from '@/domain/webinars';
import { getModelToken } from '@nestjs/mongoose';
import { MongoParticipationRepository } from './mongo-participation.repository';
import { MongoParticipation } from './mongo-participation';
import { Model } from 'mongoose';
import { AppTest } from '../../../../test/app-test';

const participation = {
  participantId: '1',
  webinarId: '1',
};

describe('MongoParticipationRepository', () => {
  let app: AppTest;
  let model: Model<MongoParticipation.SchemaClass>;
  let repository: MongoParticipationRepository;

  const createParticipationInDatabase = async (participation: {
    participantId: string;
    webinarId: string;
  }) => {
    const record = new model({
      _id: MongoParticipation.SchemaClass.generateId(participation),
      participantId: participation.participantId,
      webinarId: participation.webinarId,
    });

    await record.save();
  };

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();
    model = app.get<Model<MongoParticipation.SchemaClass>>(
      getModelToken(MongoParticipation.collection),
    );

    repository = new MongoParticipationRepository(model);

    await createParticipationInDatabase(participation);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Count participations', () => {
    it('should return the number of participations', async () => {
      const result = await repository.countParticipations(
        participation.webinarId,
      );

      expect(result).toBe(1);
    });
  });

  describe('Create participation', () => {
    it('should succeed', async () => {
      await repository.create({
        participantId: '2',
        webinarId: '2',
      });

      const result = await repository.countParticipations('2');

      expect(result).toBe(1);
    });
  });

  describe('Delete participation', () => {
    it('should succeed', async () => {
      await repository.delete({
        participantId: '1',
        webinarId: '1',
      });

      const result = await repository.countParticipations('1');

      expect(result).toBe(0);
    });
  });

  describe('Delete all participations', () => {
    it('should succeed', async () => {
      await repository.create({
        participantId: '2',
        webinarId: '1',
      });

      await repository.deleteAllParticipations('1');

      const result = await repository.countParticipations('1');

      expect(result).toBe(0);
    });
  });

  describe('Finds all participatants ids', () => {
    it('should succeed', async () => {
      await repository.create({
        participantId: '2',
        webinarId: '1',
      });

      const participantsIds = await repository.findParticipantsIds('1');

      expect(participantsIds.length).toBe(2);
      expect(participantsIds).toEqual(['1', '2']);
    });
  });

  describe('Is participant already exists', () => {
    it('should succeed', async () => {
      const result = await repository.isParticipationAlreadyExist({
        participantId: '1',
        webinarId: '1',
      });

      expect(result).toBe(true);
    });

    it('should fail', async () => {
      const result = await repository.isParticipationAlreadyExist({
        participantId: '1',
        webinarId: '2',
      });

      expect(result).toBe(false);
    });
  });
});
