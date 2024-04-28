import { FixedDateGenerator } from './../../core/adapters/fixed-date.generator';
import { FixedIdGenerator } from './../../core/adapters/fixed-id.generator';
import { DateGenerator, IdGenerator } from './../../core';
import { WebinarRepository } from './../ports';
import { InMemoryWebinarRepository } from './../adapters';
import { OrganizeWebinar } from './organize-webinar';

describe('Feature: Organizing a webinar', () => {
  let inMemoryWebinarRepository: WebinarRepository;
  let idGenerator: IdGenerator;
  let dateGenerator: DateGenerator;
  let organizeWebinar: OrganizeWebinar;

  const payload = {
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

  describe('Scenario: Happy path', () => {
    it('should return the webinars id', async () => {
      const response = await organizeWebinar.execute(payload);

      expect(response).toEqual({ id: expect.any(String) });
    });

    it('should insert the webinar into the databaes', async () => {
      const response = await organizeWebinar.execute(payload);

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
    it('should return an error', async () => {
      const webinarToday = {
        ...payload,
        start: new Date('2024-04-28T10:00:00.000Z'),
        end: new Date('2024-04-28T12:00:00.000Z'),
      };

      expect(async () => organizeWebinar.execute(webinarToday)).rejects.toThrow(
        'Webinar must happen in at least 3 days.',
      );
    });
  });
});
