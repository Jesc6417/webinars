import { Organizer } from './../entities';
import { InMemoryWebinarRepository } from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import { ChangeSeats } from './change-seats';

describe('Feature: Changing number of seats', () => {
  let inMemoryWebinarRepository: InMemoryWebinarRepository;
  let changeSeats: ChangeSeats;

  function shouldNotUpdateSeats() {
    const webinar = inMemoryWebinarRepository.findByIdSync('id-1');
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
      organizer: new Organizer({ id: 'alice' }),
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
      organizer: new Organizer({ id: 'alice' }),
      webinarId: 'id-2',
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    const payload = {
      webinarId: 'id-1',
      seats: 200,
      organizer: new Organizer({ id: 'bob' }),
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be reduced', () => {
    const payload = {
      webinarId: 'id-1',
      seats: 50,
      organizer: new Organizer({ id: 'alice' }),
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'You cannot reduce number of seats.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be updated to more than 1000 seats', () => {
    const payload = {
      webinarId: 'id-1',
      organizer: new Organizer({ id: 'alice' }),
      seats: 1001,
    };

    it('should fail', async () => {
      expect(async () => await changeSeats.execute(payload)).rejects.toThrow(
        'Webinar must have a maximum of 1000 seats.',
      );

      shouldNotUpdateSeats();
    });
  });
});
