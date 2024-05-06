import { OrganizerRepository } from '@/domain/webinars';
import { MongoOrganizer } from '@/infrastructure/mongo/organizers/mongo-organizer';
import { Model } from 'mongoose';

export class MongoOrganizerRepository extends OrganizerRepository {
  constructor(
    private readonly organizerModel: Model<MongoOrganizer.SchemaClass>,
  ) {
    super();
  }

  async findEmail(organizerId: string): Promise<string | undefined> {
    const user = await this.organizerModel.findById(organizerId);

    return user?.email;
  }
}
