import { Webinar } from './../entities';
import { ChangeSeats } from './change-seats';
import { InMemoryWebinarRepository } from './../adapters';

describe('Feature: Changing number of seats', () => {
  let inMemoryWebinarRepository: InMemoryWebinarRepository;
  let changeSeats: ChangeSeats;
  const existingWebinar = new Webinar({
    id: 'id-1',
    title: 'My first webinar',
    seats: 100,
    start: new Date('2024-05-12T10:00:00.000Z'),
    end: new Date('2024-05-12T11:00:00.000Z'),
    organizerId: 'john-doe',
  });

  async function shouldNotUpdateSeats() {
    const webinar = await inMemoryWebinarRepository.findById('id-1');
    expect(webinar!.props.seats).toBe(100);
  }

  beforeEach(() => {
    inMemoryWebinarRepository = new InMemoryWebinarRepository();
    changeSeats = new ChangeSeats(inMemoryWebinarRepository);

    inMemoryWebinarRepository.database.push(existingWebinar);
  });

  describe('Scenario: Happy path', () => {
    it('should updated the number of seats', async () => {
      const request = {
        webinarId: 'id-1',
        seats: 200,
        organizerId: 'john-doe',
      };

      await changeSeats.execute(request);

      const webinar = await inMemoryWebinarRepository.findById('id-1');
      expect(webinar!.props.seats).toBe(200);
    });
  });

  describe('Scenario: Webinar not found', () => {
    it('should fail', async () => {
      const request = {
        webinarId: 'id-2',
        seats: 200,
        organizerId: 'john-doe',
      };

      expect(async () => await changeSeats.execute(request)).rejects.toThrow(
        'Webinar not found.',
      );

      await shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    it('should fail', async () => {
      const request = {
        webinarId: 'id-1',
        seats: 200,
        organizerId: 'jane-doe',
      };

      expect(async () => await changeSeats.execute(request)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      await shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be reduced', () => {
    it('should fail', async () => {
      const request = {
        webinarId: 'id-1',
        seats: 50,
        organizerId: 'john-doe',
      };

      expect(async () => await changeSeats.execute(request)).rejects.toThrow(
        'You cannot reduce number of seats.',
      );

      await shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be updated to more than 1000 seats', () => {
    it('should fail', async () => {
      const request = {
        webinarId: 'id-1',
        seats: 1001,
        organizerId: 'john-doe',
      };

      expect(async () => await changeSeats.execute(request)).rejects.toThrow(
        'Webinar must have a maximum of 1000 seats.',
      );

      await shouldNotUpdateSeats();
    });
  });

  xdescribe('Scenario: Seats cannot be updated to less than 0 seat', () => {
    it('should fail', async () => {
      const request = {
        webinarId: 'id-1',
        seats: 0,
        organizerId: 'john-doe',
      };

      expect(async () => await changeSeats.execute(request)).rejects.toThrow(
        'Webinar must have at least 1 seat.',
      );

      const webinar = await inMemoryWebinarRepository.findById('id-1');
      expect(webinar!.props.seats).toBe(100);
    });
  });
});
