import { Participation } from '@/domain/webinars';
import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export namespace MongoParticipation {
  export const collection = 'participations';

  @MongooseSchema({ collection })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    participantId: string;

    @Prop()
    webinarId: string;

    static generateId = (participation: {
      participantId: string;
      webinarId: string;
    }) => {
      return `${participation.participantId}-${participation.webinarId}`;
    };
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
