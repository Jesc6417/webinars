import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export namespace MongoWebinar {
  export const collection = 'webinars';

  @MongooseSchema({ collection })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    organizerId: string;

    @Prop()
    title: string;

    @Prop()
    seats: number;

    @Prop()
    start: Date;

    @Prop()
    end: Date;
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
