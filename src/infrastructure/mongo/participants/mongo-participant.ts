import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export namespace MongoParticipant {
  export const collection = 'users';

  @MongooseSchema({ collection })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    email: string;
  }
}
