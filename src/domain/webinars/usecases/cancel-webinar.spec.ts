import { MailerFacade } from './../../core';
import {
  InMemoryParticipantRepository,
  InMemoryParticipationRepository,
  InMemoryWebinarRepository,
} from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import { CancelWebinar } from './cancel-webinar';

type Payload = {
  webinarId: string;
  organizerId: string;
};

describe('Feature: Cancel webinar', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let participantRepository: InMemoryParticipantRepository;
  let cancelWebinar: CancelWebinar;
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
    cancelWebinar = new CancelWebinar(
      webinarRepository,
      participationRepository,
      participantRepository,
      mailer,
    );

    webinarRepository.database.push(WebinarSeeds.existingWebinar);
    participationRepository.database.push(
      ...WebinarSeeds.existingParticipation,
    );
    participantRepository.database.push(...WebinarSeeds.existingParticipant);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      organizerId: WebinarSeeds.existingWebinar.props.organizer.props.id,
    };

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
      expect(mailer.sentEmails[0].bcc).toEqual([
        'participant-1@gmail.com',
        'participant-2@gmail.com',
      ]);
      expect(mailer.sentEmails[0].subject).toBe(
        'Webinar "My first webinar" canceled',
      );
      expect(mailer.sentEmails[0].body).toBe(
        'The webinar "My first webinar" has been canceled.',
      );
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = {
      webinarId: 'id-2',
      organizerId: WebinarSeeds.existingWebinar.props.organizer.props.id,
    };

    it('should fail', () => {
      expect(async () => await cancelWebinar.execute(payload)).rejects.toThrow(
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
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      organizerId: 'bob',
    };

    it('should fail', () => {
      expect(async () => await cancelWebinar.execute(payload)).rejects.toThrow(
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