import { InMemoryWebinarRepository } from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import { ChangeSeats } from './change-seats';

describe('Feature: Changing number of seats', () => {
  let inMemoryWebinarRepository: InMemoryWebinarRepository;
  let changeSeats: ChangeSeats;

  async function shouldNotUpdateSeats() {
    const webinar = await inMemoryWebinarRepository.findById('id-1');
    expect(webinar!.props.seats).toBe(100);
  }

  beforeEach(() => {
    inMemoryWebinarRepository = new InMemoryWebinarRepository();
    changeSeats = new ChangeSeats(inMemoryWebinarRepository);

    inMemoryWebinarRepository.database.push(WebinarSeeds.existingWebinar);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      webinarId: 'id-1',
      seats: 200,
      organizerId: 'alice',
    };

    it('should updated the number of seats', async () => {
      await changeSeats.execute(payload);

      const webinar = await inMemoryWebinarRepository.findById('id-1');
      expect(webinar!.props.seats).toBe(200);
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = {
      seats: 200,
      organizerId: 'alice',
      webinarId: 'id-2',
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );

      await shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    const payload = {
      webinarId: 'id-1',
      seats: 200,
      organizerId: 'bob',
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      await shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be reduced', () => {
    const payload = {
      webinarId: 'id-1',
      seats: 50,
      organizerId: 'alice',
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'You cannot reduce number of seats.',
      );

      await shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be updated to more than 1000 seats', () => {
    const payload = {
      webinarId: 'id-1',
      organizerId: 'alice',
      seats: 1001,
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'Webinar must have a maximum of 1000 seats.',
      );

      await shouldNotUpdateSeats();
    });
  });
});