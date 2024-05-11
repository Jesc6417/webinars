import { DateProvider, IdProvider, Mailer } from '@/domain/core';
import {
  CancelWebinarCommandHandler,
  CancelSeatCommandHandler,
  ChangeDatesCommandHandler,
  ChangeSeatsCommandHandler,
  OrganizerRepository,
  OrganizeWebinarCommandHandler,
  ParticipantRepository,
  ParticipationRepository,
  ReserveSeatCommandHandler,
  WebinarQueryStore,
  WebinarRepository,
  WebinarByIdQueryStore,
} from '@/domain/webinars';
import { ProvidersModule } from './providers.module';
import { StoreProxyModule } from './store.module';
import { ToolsModule } from './tools.module';
import { Module } from '@nestjs/common';
import { RepositoriesModule } from './repositories.module';

@Module({
  imports: [RepositoriesModule, ToolsModule, ProvidersModule, StoreProxyModule],
  providers: [
    {
      provide: OrganizeWebinarCommandHandler,
      useFactory: (
        webinarRepository: WebinarRepository,
        idGenerator: IdProvider,
        dateGenerator: DateProvider,
      ) =>
        new OrganizeWebinarCommandHandler(
          webinarRepository,
          idGenerator,
          dateGenerator,
        ),
      inject: [WebinarRepository, IdProvider, DateProvider],
    },
    {
      provide: ChangeSeatsCommandHandler,
      useFactory: (webinarRepository: WebinarRepository) =>
        new ChangeSeatsCommandHandler(webinarRepository),
      inject: [WebinarRepository],
    },
    {
      provide: ChangeDatesCommandHandler,
      useFactory: (
        webinarRepository: WebinarRepository,
        participationRepository: ParticipationRepository,
        participantRepository: ParticipantRepository,
        dateGenerator: DateProvider,
        mailer: Mailer,
      ) =>
        new ChangeDatesCommandHandler(
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
    {
      provide: CancelWebinarCommandHandler,
      useFactory: (
        webinarRepository: WebinarRepository,
        participationRepository: ParticipationRepository,
        participantRepository: ParticipantRepository,
        mailer: Mailer,
      ) =>
        new CancelWebinarCommandHandler(
          webinarRepository,
          participationRepository,
          participantRepository,
          mailer,
        ),
      inject: [
        WebinarRepository,
        ParticipationRepository,
        ParticipantRepository,
        Mailer,
      ],
    },
    {
      provide: ReserveSeatCommandHandler,
      inject: [
        ParticipationRepository,
        WebinarRepository,
        ParticipantRepository,
        OrganizerRepository,
        Mailer,
      ],
      useFactory: (
        participationRepository,
        webinarRepository,
        participantRepository,
        organizerRepository,
        mailer,
      ) =>
        new ReserveSeatCommandHandler(
          participationRepository,
          webinarRepository,
          participantRepository,
          organizerRepository,
          mailer,
        ),
    },
    {
      provide: CancelSeatCommandHandler,
      inject: [
        ParticipationRepository,
        ParticipantRepository,
        WebinarRepository,
        OrganizerRepository,
        Mailer,
      ],
      useFactory: (
        participationRepository,
        participantRepository,
        webinarRepository,
        organizerRepository,
        mailer,
      ) =>
        new CancelSeatCommandHandler(
          participationRepository,
          participantRepository,
          webinarRepository,
          organizerRepository,
          mailer,
        ),
    },
    {
      provide: WebinarByIdQueryStore,
      inject: [
        WebinarQueryStore,
        WebinarRepository,
        OrganizerRepository,
        ParticipationRepository,
      ],
      useFactory: (
        webinarQueryStore,
        webinarRepository,
        organizerRepository,
        participationRepository,
      ) =>
        new WebinarByIdQueryStore(
          webinarQueryStore,
          webinarRepository,
          organizerRepository,
          participationRepository,
        ),
    },
  ],
  exports: [
    OrganizeWebinarCommandHandler,
    ChangeSeatsCommandHandler,
    ChangeDatesCommandHandler,
    CancelWebinarCommandHandler,
    ReserveSeatCommandHandler,
    CancelSeatCommandHandler,
    WebinarByIdQueryStore,
  ],
})
export class WebinarCommandModule {}
