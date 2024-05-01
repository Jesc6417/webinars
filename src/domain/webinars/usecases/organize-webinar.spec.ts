import { WebinarSeeds } from './../tests/webinar.seeds';
import { DateProvider, IdGenerator } from './../../core';
import { FixedDateProvider } from '../../core/date/adapters/fixed-date.provider';
import { FixedIdGenerator } from '../../core/id/adapters/fixed-id.generator';
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

  const shouldNotCreateWebinarInDatabase = async (payload: {
    start: Date;
    end: Date;
    title: string;
    seats: number;
    organizerId: string;
  }) => {
    try {
      await organizeWebinar.execute(payload);
    } catch (e) {}

    expect(inMemoryWebinarRepository.database.length).toBe(0);
  };

  describe('Scenario: Happy path', () => {
    const payload = {
      title: 'My first webinar',
      seats: 100,
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizerId: 'alice',
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
      organizerId: 'alice',
      start: new Date('2024-04-28T10:00:00.000Z'),
      end: new Date('2024-04-28T12:00:00.000Z'),
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar must happen in at least 3 days.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase(payload);
    });
  });

  describe('Scenario: the webinar has too many seats', () => {
    const payload = {
      title: 'My first webinar',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizerId: 'alice',
      seats: 1001,
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar must have a maximum of 1000 seats.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase(payload);
    });
  });

  describe('Scenario: the webinar has no seats', () => {
    const payload = {
      title: 'My first webinar',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizerId: 'alice',
      seats: 0,
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar must have at least 1 seat.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase(payload);
    });
  });

  describe('Scenario: Webinar cannot end before it starts.', () => {
    const payload = {
      title: 'My first webinar',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T09:00:00.000Z'),
      organizerId: 'alice',
      seats: 100,
    };

    it('should fail', async () => {
      expect(
        async () => await organizeWebinar.execute(payload),
      ).rejects.toThrow('Webinar cannot end before it starts.');
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase(payload);
    });
  });
});
