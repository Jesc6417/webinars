import { ParticipantRepository } from '@/domain/webinars';
import { MongoParticipant } from '@/infrastructure/mongo/participants/mongo-participant';
import { Model } from 'mongoose';

export class MongoParticipantRepository extends ParticipantRepository {
  constructor(
    private readonly participantModel: Model<MongoParticipant.SchemaClass>,
  ) {
    super();
  }

  getEmailById = async (userId: string): Promise<string | undefined> => {
    const user = await this.participantModel.findById(userId);

    return user?.email;
  };
}
