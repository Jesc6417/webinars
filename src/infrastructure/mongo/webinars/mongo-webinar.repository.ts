import { Webinar, WebinarRepository } from '@/domain/webinars';
import { MongoWebinar } from '@/infrastructure/mongo/webinars/mongo-webinar';
import { Model } from 'mongoose';
import * as deepObjectDiff from 'deep-object-diff';

export class MongoWebinarRepository extends WebinarRepository {
  constructor(private model: Model<MongoWebinar.SchemaClass>) {
    super();
  }

  async cancel(webinarId: string): Promise<void> {
    await this.model.findByIdAndDelete(webinarId);
  }

  async create(webinar: Webinar): Promise<void> {
    const record = new this.model(this.toPersistence(webinar));

    await record.save();
  }

  async findById(id: string): Promise<Webinar | null> {
    const webinar = await this.model.findById(id);

    if (!webinar) return null;

    return this.toDomain(webinar);
  }

  async update(webinar: Webinar): Promise<void> {
    const difference = deepObjectDiff.diff(webinar.initialState, webinar.props);

    if (!difference) return;

    await this.model.updateOne({ _id: webinar.props.id }, difference);
  }

  private toDomain(webinar: MongoWebinar.Document): Webinar {
    return new Webinar({
      id: webinar._id,
      organizerId: webinar.organizerId,
      title: webinar.title,
      seats: webinar.seats,
      start: webinar.start,
      end: webinar.end,
    });
  }

  private toPersistence(webinar: Webinar): MongoWebinar.SchemaClass {
    return {
      _id: webinar.props.id,
      organizerId: webinar.props.organizerId,
      title: webinar.props.title,
      seats: webinar.props.seats,
      start: webinar.props.start,
      end: webinar.props.end,
    };
  }
}
