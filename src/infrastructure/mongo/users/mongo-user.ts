import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export namespace MongoUser {
  export const collection = 'users';

  @MongooseSchema({ collection })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    email: string;

    @Prop()
    token: string;
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
