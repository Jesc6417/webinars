import { MailerFacade } from './../../../core';
import { WebinarSeeds } from './../tests/webinar.seeds';
import {
  CancelSeatCommand,
  CancelSeatCommandHandler,
} from './cancel-seat.command-handler';
import {
  InMemoryOrganizerRepository,
  InMemoryParticipantRepository,
  InMemoryParticipationRepository,
  InMemoryWebinarRepository,
} from './../adapters';

describe('Feature: Cancel reservation', () => {
  let participationRepository: InMemoryParticipationRepository;
  let participantRepository: InMemoryParticipantRepository;
  let webinarRepository: InMemoryWebinarRepository;
  let organizerRepository: InMemoryOrganizerRepository;
  let mailer: MailerFacade;
  let cancelParticipation: CancelSeatCommandHandler;

  beforeEach(async () => {
    participationRepository = new InMemoryParticipationRepository();
    participantRepository = new InMemoryParticipantRepository();
    webinarRepository = new InMemoryWebinarRepository();
    organizerRepository = new InMemoryOrganizerRepository();
    mailer = new MailerFacade();
    cancelParticipation = new CancelSeatCommandHandler(
      participationRepository,
      participantRepository,
      webinarRepository,
      organizerRepository,
      mailer,
    );

    await participationRepository.create({
      webinarId: WebinarSeeds.existingParticipations[0].props.webinarId,
      participantId: WebinarSeeds.existingParticipations[0].props.participantId,
    });
    participantRepository.database.push(...WebinarSeeds.existingParticipants);
    webinarRepository.database.push(WebinarSeeds.existingWebinar);
    organizerRepository.database.push(WebinarSeeds.OrganizerAlice);
  });

  describe('Scenario: Happy path', () => {
    const payload = new CancelSeatCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.existingParticipations[0].props.participantId,
    );

    it('should cancel the reservation', async () => {
      await cancelParticipation.execute(payload);

      const participation = await participationRepository.findParticipantsIds(
        WebinarSeeds.existingParticipations[0].props.participantId,
      );

      expect(participation.length).toBe(0);
    });

    it('should send an email to the participant', async () => {
      await cancelParticipation.execute(payload);

      expect(mailer.sentEmails.length).toBe(2);
      expect(mailer.sentEmails[0]).toEqual({
        to: 'participant-1@gmail.com',
        subject: 'Webinar reservation canceled',
        body: 'Your reservation for the webinar "My first webinar" has been canceled.',
      });
    });

    it('should send an email to the organizer', async () => {
      await cancelParticipation.execute(payload);

      expect(mailer.sentEmails.length).toBe(2);
      expect(mailer.sentEmails[1]).toEqual({
        to: WebinarSeeds.OrganizerAlice.props.email,
        subject: 'Participant canceled reservation',
        body: 'The participant "participant-1@gmail.com" has canceled the reservation for the webinar "My first webinar".',
      });
    });
  });

  describe('Scenario: Participation does not exist', () => {
    const payload = new CancelSeatCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.existingParticipations[1].props.participantId,
    );

    it('should fail', async () => {
      expect(() => cancelParticipation.execute(payload)).rejects.toThrow(
        'Participation not found.',
      );
    });
  });
});
