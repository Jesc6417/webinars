import {
  DateProvider,
  FixedDateProvider,
  FixedIdProvider,
  IdProvider,
} from './../../../core';
import { InMemoryWebinarRepository } from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import {
  OrganizeWebinarCommand,
  OrganizeWebinarCommandHandler,
} from './organize-webinar.command-handler';

describe('Feature: Organizing a webinar', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let idGenerator: IdProvider;
  let dateGenerator: DateProvider;
  let organizeWebinar: OrganizeWebinarCommandHandler;

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository();

    idGenerator = new FixedIdProvider();
    dateGenerator = new FixedDateProvider();

    organizeWebinar = new OrganizeWebinarCommandHandler(
      webinarRepository,
      idGenerator,
      dateGenerator,
    );
  });

  const shouldNotCreateWebinarInDatabase = async () => {
    expect(webinarRepository.database.length).toBe(0);
  };

  describe('Scenario: Happy path', () => {
    const payload = new OrganizeWebinarCommand(
      'My first webinar',
      100,
      new Date('2024-05-12T10:00:00.000Z'),
      new Date('2024-05-12T11:00:00.000Z'),
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should return the webinars id', async () => {
      const response = await organizeWebinar.execute(payload);

      expect(response).toEqual({ id: WebinarSeeds.existingWebinar.props.id });
    });

    it('should insert the webinar into the databaes', async () => {
      const response = await organizeWebinar.execute(payload);

      const webinar = await webinarRepository.findById(response.id);
      expect(webinar!.props).toEqual(WebinarSeeds.existingWebinar.props);
    });
  });

  describe('Scenario: the webinar happens too soon', () => {
    const payload = new OrganizeWebinarCommand(
      'My first webinar',
      100,
      new Date('2024-04-28T10:00:00.000Z'),
      new Date('2024-04-28T12:00:00.000Z'),
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => organizeWebinar.execute(payload)).rejects.toThrow(
        'Webinar must happen in at least 3 days.',
      );
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });

  describe('Scenario: the webinar has too many seats', () => {
    const payload = new OrganizeWebinarCommand(
      'My first webinar',
      1001,
      new Date('2024-05-12T10:00:00.000Z'),
      new Date('2024-05-12T11:00:00.000Z'),
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => organizeWebinar.execute(payload)).rejects.toThrow(
        'Webinar must have a maximum of 1000 seats.',
      );
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });

  describe('Scenario: the webinar has no seats', () => {
    const payload = new OrganizeWebinarCommand(
      'My first webinar',
      0,
      new Date('2024-05-12T10:00:00.000Z'),
      new Date('2024-05-12T11:00:00.000Z'),
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => organizeWebinar.execute(payload)).rejects.toThrow(
        'Webinar must have at least 1 seat.',
      );
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });

  describe('Scenario: Webinar cannot end before it starts.', () => {
    const payload = new OrganizeWebinarCommand(
      'My first webinar',
      100,
      new Date('2024-05-12T10:00:00.000Z'),
      new Date('2024-05-12T09:00:00.000Z'),
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => organizeWebinar.execute(payload)).rejects.toThrow(
        'Webinar cannot end before it starts.',
      );
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });
});
