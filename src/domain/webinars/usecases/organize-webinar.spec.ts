import { Organizer } from './../entities';
import { WebinarSeeds } from './../tests/webinar.seeds';
import {
  DateProvider,
  IdGenerator,
  FixedDateProvider,
  FixedIdGenerator,
} from './../../core';
import { InMemoryWebinarRepository } from './../adapters';
import { OrganizeWebinar } from './organize-webinar';

describe('Feature: Organizing a webinar', () => {
  let inMemoryWebinarRepository: InMemoryWebinarRepository;
  let idGenerator: IdGenerator;
  let dateGenerator: DateProvider;
  let organizeWebinar: OrganizeWebinar;

  beforeEach(() => {
    inMemoryWebinarRepository = new InMemoryWebinarRepository();
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateProvider();

    organizeWebinar = new OrganizeWebinar(
      inMemoryWebinarRepository,
      idGenerator,
      dateGenerator,
    );
  });

  const shouldNotCreateWebinarInDatabase = async () => {
    expect(inMemoryWebinarRepository.database.length).toBe(0);
  };

  describe('Scenario: Happy path', () => {
    const payload = {
      title: 'My first webinar',
      seats: 100,
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizer: new Organizer({ id: 'alice' }),
    };

    it('should return the webinars id', async () => {
      const response = await organizeWebinar.execute(payload);

      expect(response).toEqual({ id: expect.any(String) });
    });

    it('should insert the webinar into the databaes', async () => {
      const response = await organizeWebinar.execute(payload);

      const webinar = await inMemoryWebinarRepository.findById(response.id);
      expect(webinar!.props).toEqual(WebinarSeeds.existingWebinar.props);
    });
  });

  describe('Scenario: the webinar happens too soon', () => {
    const payload = {
      title: 'My first webinar',
      seats: 100,
      organizer: new Organizer({ id: 'alice' }),
      start: new Date('2024-04-28T10:00:00.000Z'),
      end: new Date('2024-04-28T12:00:00.000Z'),
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar must happen in at least 3 days.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });

  describe('Scenario: the webinar has too many seats', () => {
    const payload = {
      title: 'My first webinar',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizer: new Organizer({ id: 'alice' }),
      seats: 1001,
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar must have a maximum of 1000 seats.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });

  describe('Scenario: the webinar has no seats', () => {
    const payload = {
      title: 'My first webinar',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizer: new Organizer({ id: 'alice' }),
      seats: 0,
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar must have at least 1 seat.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });

  describe('Scenario: Webinar cannot end before it starts.', () => {
    const payload = {
      title: 'My first webinar',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T09:00:00.000Z'),
      organizer: new Organizer({ id: 'alice' }),
      seats: 100,
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar cannot end before it starts.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase();
    });
  });
});
