import { DateProvider, IdProvider, Mailer } from '@/domain/core';
import {
  CancelWebinar,
  ChangeDates,
  ChangeSeats,
  OrganizerRepository,
  OrganizeWebinar,
  ParticipantRepository,
  ParticipationRepository,
  ReserveSeat,
  WebinarRepository,
} from '@/domain/webinars';
import { CancelSeat } from '@/domain/webinars/usecases/cancel-seat';
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
        idGenerator: IdProvider,
        dateGenerator: DateProvider,
      ) => new OrganizeWebinar(webinarRepository, idGenerator, dateGenerator),
      inject: [WebinarRepository, IdProvider, DateProvider],
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
    {
      provide: CancelWebinar,
      useFactory: (
        webinarRepository: WebinarRepository,
        participationRepository: ParticipationRepository,
        participantRepository: ParticipantRepository,
        mailer: Mailer,
      ) =>
        new CancelWebinar(
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
      provide: ReserveSeat,
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
        new ReserveSeat(
          participationRepository,
          webinarRepository,
          participantRepository,
          organizerRepository,
          mailer,
        ),
    },
    {
      provide: CancelSeat,
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
        new CancelSeat(
          participationRepository,
          participantRepository,
          webinarRepository,
          organizerRepository,
          mailer,
        ),
    },
  ],
  exports: [
    OrganizeWebinar,
    ChangeSeats,
    ChangeDates,
    CancelWebinar,
    ReserveSeat,
    CancelSeat,
  ],
})
export class WebinarProxyModule {}
