import { Prop, Schema as MongooseSchema } from '@nestjs/mongoose';

export namespace MongoOrganizer {
  export const collection = 'users';

  @MongooseSchema({ collection })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    email: string;
  }
}
