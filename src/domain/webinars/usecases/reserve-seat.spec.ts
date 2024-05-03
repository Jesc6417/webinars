import { MailerFacade } from './../../core';
import { ReserveSeat } from './reserve-seat';
import { WebinarSeeds } from './../tests/webinar.seeds';
import {
  InMemoryOrganizerRepository,
  InMemoryParticipantRepository,
  InMemoryParticipationRepository,
  InMemoryWebinarRepository,
} from './../adapters';

describe('Feature: Reserve seat', () => {
  let participationRepository: InMemoryParticipationRepository;
  let webinarRepository: InMemoryWebinarRepository;
  let participantRepository: InMemoryParticipantRepository;
  let organizerRepository: InMemoryOrganizerRepository;
  let reserveSeat: ReserveSeat;
  let mailer: MailerFacade;

  beforeEach(async () => {
    participationRepository = new InMemoryParticipationRepository();
    webinarRepository = new InMemoryWebinarRepository();
    participantRepository = new InMemoryParticipantRepository();
    organizerRepository = new InMemoryOrganizerRepository();
    mailer = new MailerFacade();
    reserveSeat = new ReserveSeat(
      participationRepository,
      webinarRepository,
      participantRepository,
      organizerRepository,
      mailer,
    );

    webinarRepository.database.push(
      WebinarSeeds.existingWebinarWithOnlyOneSeat,
    );
    participantRepository.database.push(...WebinarSeeds.existingParticipants);
    organizerRepository.database.push(
      WebinarSeeds.OrganizerAlice,
      WebinarSeeds.OrganizerBob,
    );
  });

  describe('Scenario Happy path', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      participantId: WebinarSeeds.existingParticipants[0].props.id,
    };

    it('should reserve seat', async () => {
      await reserveSeat.execute(payload);

      const participation = await participationRepository.findUsersIds(
        WebinarSeeds.existingWebinar.props.id,
      );

      expect(participation.length).toBe(1);
      expect(participation[0]).toBe(
        WebinarSeeds.existingParticipants[0].props.id,
      );
    });

    it('should send a confirmation email to the participant', async () => {
      await reserveSeat.execute(payload);

      expect(mailer.sentEmails.length).toBe(2);
      expect(mailer.sentEmails[0]).toEqual({
        to: WebinarSeeds.existingParticipants[0].props.email,
        subject: `Reservation for webinar "${WebinarSeeds.existingWebinar.props.title}"`,
        body: `You have successfully reserved a seat for the webinar "${WebinarSeeds.existingWebinar.props.title}".`,
      });
    });

    it('should send an information email to the organizer', async () => {
      await reserveSeat.execute(payload);

      expect(mailer.sentEmails.length).toBe(2);
      expect(mailer.sentEmails[1]).toEqual({
        to: 'alice@gmail.com',
        subject: `New reservation for webinar "${WebinarSeeds.existingWebinar.props.title}"`,
        body: `A new participant has reserved a seat for the webinar "${WebinarSeeds.existingWebinar.props.title}".`,
      });
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = {
      webinarId: 'id-2',
      participantId: WebinarSeeds.existingParticipants[0].props.id,
    };

    it('should reject', async () => {
      expect(async () => reserveSeat.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );
    });
  });

  describe('Scenario: Not enough seats', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinarWithOnlyOneSeat.props.id,
      participantId: WebinarSeeds.existingParticipants[0].props.id,
    };

    it('should reject', async () => {
      await participationRepository.create({
        webinarId: WebinarSeeds.existingWebinarWithOnlyOneSeat.props.id,
        participantId: WebinarSeeds.existingParticipants[1].props.id,
      });

      expect(async () => reserveSeat.execute(payload)).rejects.toThrow(
        'No more seats available.',
      );
    });
  });

  describe('Scenario: Participant already registered', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      participantId: WebinarSeeds.existingParticipants[0].props.id,
    };

    it('should reject', async () => {
      await participationRepository.create({
        webinarId: WebinarSeeds.existingWebinarWithOnlyOneSeat.props.id,
        participantId: WebinarSeeds.existingParticipants[0].props.id,
      });

      expect(async () => reserveSeat.execute(payload)).rejects.toThrow(
        'Participant already registered.',
      );
    });
  });

  describe('Scenario: Participant not found', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      participantId: 'id-2',
    };

    it('should reject', async () => {
      expect(async () => reserveSeat.execute(payload)).rejects.toThrow(
        'Participant not found.',
      );
    });
  });
});
