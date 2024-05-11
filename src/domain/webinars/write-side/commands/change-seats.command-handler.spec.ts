import { InMemoryWebinarRepository } from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import {
  ChangeSeatsCommand,
  ChangeSeatsCommandHandler,
} from './change-seats.command-handler';

describe('Feature: Changing number of seats', () => {
  let inMemoryWebinarRepository: InMemoryWebinarRepository;
  let changeSeats: ChangeSeatsCommandHandler;

  function shouldNotUpdateSeats() {
    const webinar = inMemoryWebinarRepository.findByIdSync(
      WebinarSeeds.existingWebinar.props.id,
    );
    expect(webinar!.props.seats).toBe(100);
  }

  beforeEach(() => {
    inMemoryWebinarRepository = new InMemoryWebinarRepository();
    changeSeats = new ChangeSeatsCommandHandler(inMemoryWebinarRepository);

    inMemoryWebinarRepository.database.push(WebinarSeeds.existingWebinar);
  });

  describe('Scenario: Happy path', () => {
    const payload = new ChangeSeatsCommand(
      WebinarSeeds.existingWebinar.props.id,
      200,
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should updated the number of seats', async () => {
      await changeSeats.execute(payload);

      const webinar = await inMemoryWebinarRepository.findById(
        WebinarSeeds.existingWebinar.props.id,
      );
      expect(webinar!.props.seats).toBe(200);
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = new ChangeSeatsCommand(
      'id-2',
      200,
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    const payload = new ChangeSeatsCommand(
      WebinarSeeds.existingWebinar.props.id,
      200,
      WebinarSeeds.OrganizerBob.props.id,
    );

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be reduced', () => {
    const payload = new ChangeSeatsCommand(
      WebinarSeeds.existingWebinar.props.id,
      50,
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'You cannot reduce number of seats.',
      );

      shouldNotUpdateSeats();
    });
  });

  describe('Scenario: Seats cannot be updated to more than 1000 seats', () => {
    const payload = new ChangeSeatsCommand(
      WebinarSeeds.existingWebinar.props.id,
      1001,
      WebinarSeeds.OrganizerAlice.props.id,
    );

    it('should fail', () => {
      expect(() => changeSeats.execute(payload)).rejects.toThrow(
        'Webinar must have a maximum of 1000 seats.',
      );

      shouldNotUpdateSeats();
    });
  });
});
