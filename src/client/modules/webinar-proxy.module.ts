import { DateProvider, IdGenerator, Mailer } from '@/domain/core';
import {
  ChangeDates,
  ChangeSeats,
  OrganizeWebinar,
  ParticipantRepository,
  ParticipationRepository,
  WebinarRepository,
} from '@/domain/webinars';
import { ProvidersModule } from './providers.module';
import { ToolsModule } from './tools.module';
import { Module } from '@nestjs/common';
import { RepositoriesModule } from './repositories.module';

@Module({
  imports: [RepositoriesModule, ToolsModule, ProvidersModule],
  providers: [
    {
      provide: OrganizeWebinar,
      useFactory: (
        webinarRepository: WebinarRepository,
        idGenerator: IdGenerator,
        dateGenerator: DateProvider,
      ) => new OrganizeWebinar(webinarRepository, idGenerator, dateGenerator),
      inject: [WebinarRepository, IdGenerator, DateProvider],
    },
    {
      provide: ChangeSeats,
      useFactory: (webinarRepository: WebinarRepository) =>
        new ChangeSeats(webinarRepository),
      inject: [WebinarRepository],
    },
    {
      provide: ChangeDates,
      useFactory: (
        webinarRepository: WebinarRepository,
        participationRepository: ParticipationRepository,
        participantRepository: ParticipantRepository,
        dateGenerator: DateProvider,
        mailer: Mailer,
      ) =>
        new ChangeDates(
          webinarRepository,
          participationRepository,
          participantRepository,
          dateGenerator,
          mailer,
        ),
      inject: [
        WebinarRepository,
        ParticipationRepository,
        ParticipantRepository,
        DateProvider,
        Mailer,
      ],
    },
  ],
  exports: [OrganizeWebinar, ChangeSeats, ChangeDates],
})
export class WebinarProxyModule {}
