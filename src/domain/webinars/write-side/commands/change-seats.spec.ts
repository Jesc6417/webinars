import { InMemoryWebinarRepository } from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import { ChangeSeats } from './change-seats';

describe('Feature: Changing number of seats', () => {
  let inMemoryWebinarRepository: InMemoryWebinarRepository;
  let changeSeats: ChangeSeats;

  function shouldNotUpdateSeats() {
    const webinar = inMemoryWebinarRepository.findByIdSync(
      WebinarSeeds.existingWebinar.props.id,
    );
    expect(webinar!.props.seats).toBe(100);
  }

  beforeEach(() => {
    inMemoryWebinarRepository = new InMemoryWebinarRepository();
    changeSeats = new ChangeSeats(inMemoryWebinarRepository);

    inMemoryWebinarRepository.database.push(WebinarSeeds.existingWebinar);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      seats: 200,
      organizerId: WebinarSeeds.OrganizerAlice.props.id,
    };

    it('should updated the number of seats', async () => {
      await changeSeats.execute(payload);

      const webinar = await inMemoryWebinarRepository.findById(
        WebinarSeeds.existingWebinar.props.id,
      );
      expect(webinar!.props.seats).toBe(200);
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = {
      seats: 200,
      organizerId: WebinarSeeds.OrganizerAlice.props.id,
      webinarId: 'id-2',
    };

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      seats: 200,
      organizerId: WebinarSeeds.OrganizerBob.props.id,
    };

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be reduced', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      seats: 50,
      organizerId: WebinarSeeds.OrganizerAlice.props.id,
    };

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'You cannot reduce number of seats.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be updated to more than 1000 seats', () => {
    const payload = {
      webinarId: WebinarSeeds.existingWebinar.props.id,
      organizerId: WebinarSeeds.OrganizerAlice.props.id,
      seats: 1001,
    };

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'Webinar must have a maximum of 1000 seats.',
      );

      shouldNotUpdateSeats();
    });
  });
});
