import { FixedDateGenerator } from './../../core/adapters/fixed-date.generator';
import { FixedIdGenerator } from './../../core/adapters/fixed-id.generator';
import { DateGenerator, IdGenerator } from './../../core';
import { WebinarRepository } from './../ports';
import { InMemoryWebinarRepository } from './../adapters';
import { OrganizeWebinar } from './organize-webinar';

describe('Feature: Organizing a webinar', () => {
  let inMemoryWebinarRepository: InMemoryWebinarRepository;
  let idGenerator: IdGenerator;
  let dateGenerator: DateGenerator;
  let organizeWebinar: OrganizeWebinar;

  const myFirstWebinar = {
    title: 'My first webinar',
    seats: 100,
    start: new Date('2024-05-02T10:00:00.000Z'),
    end: new Date('2024-05-02T11:00:00.000Z'),
  };

  beforeEach(() => {
    inMemoryWebinarRepository = new InMemoryWebinarRepository();
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();

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
  }) => {
    try {
      await organizeWebinar.execute(payload);
    } catch (e) {}

    expect(inMemoryWebinarRepository.database.length).toBe(0);
  };

  describe('Scenario: Happy path', () => {
    it('should return the webinars id', async () => {
      const response = await organizeWebinar.execute(myFirstWebinar);

      expect(response).toEqual({ id: expect.any(String) });
    });

    it('should insert the webinar into the databaes', async () => {
      const response = await organizeWebinar.execute(myFirstWebinar);

      const webinar = await inMemoryWebinarRepository.findById(response.id);
      expect(webinar!.props).toEqual({
        id: 'id-1',
        title: 'My first webinar',
        seats: 100,
        start: new Date('2024-05-02T10:00:00.000Z'),
        end: new Date('2024-05-02T11:00:00.000Z'),
      });
    });
  });

  describe('Scenario: the webinar happens too soon', () => {
    const payload = {
      ...myFirstWebinar,
      start: new Date('2024-04-28T10:00:00.000Z'),
      end: new Date('2024-04-28T12:00:00.000Z'),
    };

    it('should return an error', async () => {
      expect(async () => organizeWebinar.execute(payload)).rejects.toThrow(
        'Webinar must happen in at least 3 days.',
      );
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase(payload);
    });
  });

  describe('Scenario: the webinar has too many seats', () => {
    const payload = {
      ...myFirstWebinar,
      seats: 1001,
    };

    it('should return an error', async () => {
      expect(async () => organizeWebinar.execute(payload)).rejects.toThrow(
        'Webinar must have a maximum of 1000 seats.',
      );
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase(payload);
    });
  });

  describe('Scenario: the webinar has no seats', () => {
    const payload = {
      ...myFirstWebinar,
      seats: 0,
    };

    it('should return an error', async () => {
      expect(async () => organizeWebinar.execute(payload)).rejects.toThrow(
        'Webinar must have at least 1 seat.',
      );
    });

    it('should not create the webinar into the database', async () => {
      await shouldNotCreateWebinarInDatabase(payload);
    });
  });
});
