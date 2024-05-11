import { UserRepository } from '@/domain/users';
import {
  OrganizerRepository,
  ParticipantRepository,
  ParticipationRepository,
  WebinarRepository,
} from '@/domain/webinars';
import {
  MongoModule,
  MongoOrganizer,
  MongoOrganizerRepository,
  MongoParticipant,
  MongoParticipantRepository,
  MongoParticipation,
  MongoParticipationRepository,
  MongoUser,
  MongoUserRepository,
  MongoWebinar,
  MongoWebinarRepository,
} from '@/infrastructure/mongo';
import { Module } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Module({
  imports: [MongoModule],
  providers: [
    {
      provide: WebinarRepository,
      inject: [getModelToken(MongoWebinar.collection)],
      useFactory: (model) => new MongoWebinarRepository(model),
    },
    {
      provide: UserRepository,
      inject: [getModelToken(MongoUser.collection)],
      useFactory: (model) => new MongoUserRepository(model),
    },
    {
      provide: ParticipationRepository,
      inject: [getModelToken(MongoParticipation.collection)],
      useFactory: (model) => new MongoParticipationRepository(model),
    },
    {
      provide: ParticipantRepository,
      inject: [getModelToken(MongoParticipant.collection)],
      useFactory: (model) => new MongoParticipantRepository(model),
    },
    {
      provide: OrganizerRepository,
      inject: [getModelToken(MongoOrganizer.collection)],
      useFactory: (model) => new MongoOrganizerRepository(model),
    },
  ],
  exports: [
    WebinarRepository,
    UserRepository,
    ParticipantRepository,
    ParticipationRepository,
    OrganizerRepository,
  ],
})
export class RepositoriesModule {}
