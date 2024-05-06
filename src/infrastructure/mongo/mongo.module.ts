import { MongoParticipant } from '@/infrastructure/mongo/participants';
import { MongoParticipation } from '@/infrastructure/mongo/participations/mongo-participation';
import { MongoUser } from './users/mongo-user';
import { MongoWebinar } from '@/infrastructure/mongo/webinars/mongo-webinar';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoUser.collection,
        schema: MongoUser.Schema,
      },
      {
        name: MongoWebinar.collection,
        schema: MongoWebinar.Schema,
      },
      {
        name: MongoParticipation.collection,
        schema: MongoParticipation.Schema,
      },
    ]),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class MongoModule {}
