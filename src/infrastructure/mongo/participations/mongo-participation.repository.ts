import { Participation, ParticipationRepository } from '@/domain/webinars';
import { MongoParticipation } from './mongo-participation';
import { Model } from 'mongoose';

export class MongoParticipationRepository extends ParticipationRepository {
  constructor(private readonly model: Model<MongoParticipation.SchemaClass>) {
    super();
  }

  async countParticipations(webinarId: string): Promise<number> {
    const count = await this.model.countDocuments({ webinarId });

    return count;
  }

  async create(request: {
    participantId: string;
    webinarId: string;
  }): Promise<void> {
    const record = new this.model(this.toPersistence(request));

    await record.save();
  }

  async delete(request: {
    participantId: string;
    webinarId: string;
  }): Promise<void> {
    await this.model
      .findOne({
        participantId: request.participantId,
        webinarId: request.webinarId,
      })
      .deleteOne()
      .exec();
  }

  async deleteAllParticipations(webinarId: string): Promise<void> {
    const allParticipations = this.model.find({ webinarId });

    await allParticipations.deleteMany().exec();
  }

  findParticipantsIds = async (webinarId: string): Promise<string[]> =>
    this.model.find({ webinarId }).distinct('participantId');

  isParticipationAlreadyExist = async (request: {
    participantId: string;
    webinarId: string;
  }): Promise<boolean> => {
    const exist = await this.model.exists({
      participantId: request.participantId,
      webinarId: request.webinarId,
    });

    return exist !== null;
  };

  private toDomain(participation: MongoParticipation.Document): Participation {
    return new Participation({
      participantId: participation.participantId,
      webinarId: participation.webinarId,
    });
  }

  private toPersistence(participation: {
    participantId: string;
    webinarId: string;
  }): MongoParticipation.SchemaClass {
    return {
      _id: MongoParticipation.SchemaClass.generateId({
        participantId: participation.participantId,
        webinarId: participation.webinarId,
      }),
      participantId: participation.participantId,
      webinarId: participation.webinarId,
    };
  }
}
