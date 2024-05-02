import { MailerFacade } from './../../core/mailer/adapters/mailer.facade';
import { Participation, Participant } from './../entities';
import { DateProvider, FixedDateProvider } from './../../core';
import {
  InMemoryWebinarRepository,
  InMemoryParticipationRepository,
  InMemoryParticipantRepository,
} from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import { ChangeDates } from './change-dates';

describe('Feature: Change webinars dates', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let participantRepository: InMemoryParticipantRepository;
  let dateProvider: DateProvider;
  let mailer: MailerFacade;
  let useCase: ChangeDates;

  function shouldNotChangeDates() {
    const webinar = webinarRepository.findByIdSync('id-1');
    expect(webinar!.props.start).toEqual(new Date('2024-05-12T10:00:00.000Z'));
    expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
  }

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository();
    participationRepository = new InMemoryParticipationRepository();
    participantRepository = new InMemoryParticipantRepository();
    mailer = new MailerFacade();
    dateProvider = new FixedDateProvider();
    useCase = new ChangeDates(
      webinarRepository,
      participationRepository,
      participantRepository,
      dateProvider,
      mailer,
    );

    webinarRepository.database.push(WebinarSeeds.existingWebinar);
  });

  describe('Scenario: Happy path', () => {
    it('should change the dates of the webinar', async () => {
      await useCase.execute({
        webinarId: 'id-1',
        start: new Date('2024-05-12T10:00:00.000Z'),
        end: new Date('2024-05-12T11:00:00.000Z'),
        organizerId: 'alice',
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T10:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
    });

    it('should send an email to the participants', async () => {
      participationRepository.database.push(
        new Participation({
          webinarId: WebinarSeeds.existingWebinar.props.id,
          userId: 'bob',
        }),
      );

      participantRepository.database.push(
        new Participant({
          id: 'bob',
          email: 'bob@gmail.com',
        }),
      );

      await useCase.execute({
        webinarId: WebinarSeeds.existingWebinar.props.id,
        start: new Date('2024-05-12T10:00:00.000Z'),
        end: new Date('2024-05-12T11:00:00.000Z'),
        organizerId: 'alice',
      });

      expect(mailer.sentEmails).toHaveLength(1);
      expect(mailer.sentEmails[0].bcc).toEqual(['bob@gmail.com']);
      expect(mailer.sentEmails[0].subject).toEqual('Webinar dates changed');
      expect(mailer.sentEmails[0].body).toEqual(
        'The webinar "My first webinar" has new dates: 12/05/2024 12:00 - 12/05/2024 13:00.',
      );
    });

    it('should change the start of the webinar', async () => {
      await useCase.execute({
        webinarId: 'id-1',
        start: new Date('2024-05-12T08:00:00.000Z'),
        organizerId: 'alice',
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T08:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
    });

    it('should change the end of the webinar', async () => {
      await useCase.execute({
        webinarId: 'id-1',
        end: new Date('2024-05-12T12:00:00.000Z'),
        organizerId: 'alice',
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T10:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T12:00:00.000Z'));
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = {
      webinarId: 'id-2',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizerId: 'alice',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    const payload = {
      webinarId: 'id-1',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizerId: 'bob',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar cannot happens too soon', () => {
    const payload = {
      webinarId: 'id-1',
      start: new Date('2024-04-28T10:00:00.000Z'),
      end: new Date('2024-04-28T12:00:00.000Z'),
      organizerId: 'alice',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'Webinar must happen in at least 3 days.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar cannot end before it start', () => {
    const payload = {
      webinarId: 'id-1',
      start: new Date('2024-05-28T12:00:00.000Z'),
      end: new Date('2024-05-28T10:00:00.000Z'),
      organizerId: 'alice',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'Webinar cannot end before it starts.',
      );

      shouldNotChangeDates();
    });
  });
});
