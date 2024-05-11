import { MailerFacade, DateProvider, FixedDateProvider } from './../../../core';
import {
  InMemoryWebinarRepository,
  InMemoryParticipationRepository,
  InMemoryParticipantRepository,
} from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import {
  ChangeDatesCommand,
  ChangeDatesCommandHandler,
} from './change-dates.command-handler';

describe('Feature: Change webinars dates', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let participantRepository: InMemoryParticipantRepository;
  let dateProvider: DateProvider;
  let mailer: MailerFacade;
  let useCase: ChangeDatesCommandHandler;

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
    useCase = new ChangeDatesCommandHandler(
      webinarRepository,
      participationRepository,
      participantRepository,
      dateProvider,
      mailer,
    );

    webinarRepository.database.push(WebinarSeeds.existingWebinar);
  });

  describe('Scenario: Happy path', () => {
    const payload = new ChangeDatesCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.OrganizerAlice.props.id,
      new Date('2024-05-12T10:00:00.000Z'),
      new Date('2024-05-12T11:00:00.000Z'),
    );

    it('should change the dates of the webinar', async () => {
      await useCase.execute(payload);

      const webinar = await webinarRepository.findById(
        WebinarSeeds.existingWebinar.props.id,
      );
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T10:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
    });

    it('should send an email to the participants', async () => {
      participationRepository.database.push(
        ...WebinarSeeds.existingParticipations,
      );

      participantRepository.database.push(...WebinarSeeds.existingParticipants);

      await useCase.execute(payload);

      expect(mailer.sentEmails).toHaveLength(1);
      expect(mailer.sentEmails).toEqual([
        {
          bcc: ['participant-1@gmail.com', 'participant-2@gmail.com'],
          subject: 'Webinar dates changed',
          body: 'The webinar "My first webinar" has new dates: 12/05/2024 12:00 - 12/05/2024 13:00.',
        },
      ]);
    });

    it('should change the start of the webinar', async () => {
      await useCase.execute({
        webinarId: WebinarSeeds.existingWebinar.props.id,
        organizerId: WebinarSeeds.OrganizerAlice.props.id,
        start: new Date('2024-05-12T08:00:00.000Z'),
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T08:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
    });

    it('should change the end of the webinar', async () => {
      await useCase.execute({
        webinarId: WebinarSeeds.existingWebinar.props.id,
        organizerId: WebinarSeeds.OrganizerAlice.props.id,
        end: new Date('2024-05-12T12:00:00.000Z'),
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T10:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T12:00:00.000Z'));
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = new ChangeDatesCommand(
      'id-2',
      WebinarSeeds.OrganizerAlice.props.id,
      new Date('2024-05-12T10:00:00.000Z'),
      new Date('2024-05-12T11:00:00.000Z'),
    );

    it('should fail', () => {
      expect(() => useCase.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    const payload = new ChangeDatesCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.OrganizerBob.props.id,
      new Date('2024-05-12T10:00:00.000Z'),
      new Date('2024-05-12T11:00:00.000Z'),
    );

    it('should fail', () => {
      expect(() => useCase.execute(payload)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar cannot happens too soon', () => {
    const payload = new ChangeDatesCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.OrganizerAlice.props.id,
      new Date('2024-04-28T10:00:00.000Z'),
      new Date('2024-04-28T12:00:00.000Z'),
    );

    it('should fail', () => {
      expect(() => useCase.execute(payload)).rejects.toThrow(
        'Webinar must happen in at least 3 days.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar cannot end before it start', () => {
    const payload = new ChangeDatesCommand(
      WebinarSeeds.existingWebinar.props.id,
      WebinarSeeds.OrganizerAlice.props.id,
      new Date('2024-05-28T12:00:00.000Z'),
      new Date('2024-05-28T10:00:00.000Z'),
    );

    it('should fail', () => {
      expect(() => useCase.execute(payload)).rejects.toThrow(
        'Webinar cannot end before it starts.',
      );

      shouldNotChangeDates();
    });
  });
});
