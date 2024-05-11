import { MailerFacade } from './../../../core';
import {
  InMemoryParticipantRepository,
  InMemoryParticipationRepository,
  InMemoryWebinarRepository,
} from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import {
  CancelWebinarCommand,
  CancelWebinarCommandHandler,
} from './cancel-webinar.command-handler';

type Payload = {
  webinarId: string;
  organizerId: string;
};

describe('Feature: Cancel webinar', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let participantRepository: InMemoryParticipantRepository;
  let cancelWebinar: CancelWebinarCommandHandler;
  let mailer: MailerFacade;

  async function shouldNotDeleteParticipations(payload: Payload) {
    try {
      await cancelWebinar.execute(payload);
    } catch (error) {}

    expect(participationRepository.database.length).toBe(3);
  }

  async function shouldNotSendEmail(payload: Payload) {
    try {
      await cancelWebinar.execute(payload);
    } catch (error) {}

    expect(mailer.sentEmails.length).toBe(0);
  }

  beforeEach(async () => {
    webinarRepository = new InMemoryWebinarRepository();
    participationRepository = new InMemoryParticipationRepository();
    participantRepository = new InMemoryParticipantRepository();
    mailer = new MailerFacade();
    cancelWebinar = new CancelWebinarCommandHandler(
      webinarRepository,
      participationRepository,
      participantRepository,
      mailer,
    );

    webinarRepository.database.push(WebinarSeeds.existingWebinar);
    participationRepository.database.push(
      ...WebinarSeeds.existingParticipations,
    );
    participantRepository.database.push(...WebinarSeeds.existingParticipants);
  });

  describe('Scenario: Happy path', () => {
    const payload = new CancelWebinarCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should cancel the webinar', async () => {
      await cancelWebinar.execute(payload);

      expect(webinarRepository.database.length).toBe(0);
    });

    it('should delete participations', async () => {
      await cancelWebinar.execute(payload);

      expect(participationRepository.database.length).toBe(1);
    });

    it('should send an email to the participants', async () => {
      await cancelWebinar.execute(payload);

      expect(mailer.sentEmails.length).toBe(1);
      expect(mailer.sentEmails).toEqual([
        {
          bcc: ['participant-1@gmail.com', 'participant-2@gmail.com'],
          subject: 'Webinar "My first webinar" canceled',
          body: 'The webinar "My first webinar" has been canceled.',
        },
      ]);
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = new CancelWebinarCommand(
      'id-2',
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => cancelWebinar.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );
    });

    it('should not delete participations', async () => {
      await shouldNotDeleteParticipations(payload);
    });

    it('should not send an email', async () => {
      await shouldNotSendEmail(payload);
    });
  });

  describe('Scenario: Delete webinar from someone else', () => {
    const payload = new CancelWebinarCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.OrganizerBob.props.id,
    );

    it('should fail', () => {
      expect(() => cancelWebinar.execute(payload)).rejects.toThrow(
        'You are not allowed to delete this webinar.',
      );
    });

    it('should not delete participations', async () => {
      await shouldNotDeleteParticipations(payload);
    });

    it('should not send an email', async () => {
      await shouldNotSendEmail(payload);
    });
  });
});
