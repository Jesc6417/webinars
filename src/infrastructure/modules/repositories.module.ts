import { InMemoryUserRepository, UserRepository } from '@/domain/users';
import {
  InMemoryParticipantRepository,
  InMemoryParticipationRepository,
  InMemoryWebinarRepository,
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
  ],
  exports: [
    WebinarRepository,
    UserRepository,
    ParticipantRepository,
    ParticipationRepository,
  ],
})
export class RepositoriesModule {}
