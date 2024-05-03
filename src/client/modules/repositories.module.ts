import { InMemoryUserRepository, UserRepository } from '@/domain/users';
import {
  InMemoryOrganizerRepository,
  InMemoryParticipantRepository,
  InMemoryParticipationRepository,
  InMemoryWebinarRepository,
  OrganizerRepository,
  ParticipantRepository,
  ParticipationRepository,
  WebinarRepository,
} from '@/domain/webinars';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: WebinarRepository,
      useClass: InMemoryWebinarRepository,
    },
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
    {
      provide: ParticipationRepository,
      useClass: InMemoryParticipationRepository,
    },
    {
      provide: ParticipantRepository,
      useClass: InMemoryParticipantRepository,
    },
    {
      provide: OrganizerRepository,
      useClass: InMemoryOrganizerRepository,
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
