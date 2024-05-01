import { FixedDateProvider } from '../../core/date/adapters/fixed-date.provider';
import { DateProvider } from './../../core';
import { InMemoryWebinarRepository } from './../adapters';
import { WebinarSeeds } from './../tests/webinar.seeds';
import { ChangeDates } from './change-dates';

describe('Feature: Change webinars dates', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let dateProvider: DateProvider;
  let useCase: ChangeDates;

  function shouldNotChangeDates() {
    const webinar = webinarRepository.findByIdSync('id-1');
    expect(webinar!.props.start).toEqual(new Date('2024-05-12T10:00:00.000Z'));
    expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
  }

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository();
    dateProvider = new FixedDateProvider();
    useCase = new ChangeDates(webinarRepository, dateProvider);

    webinarRepository.database.push(WebinarSeeds.existingWebinar);
  });

  describe('Scenario: Happy path', () => {
    it('should change the dates of the webinar', async () => {
      await useCase.execute({
        webinarId: 'id-1',
        start: new Date('2024-05-12T10:00:00.000Z'),
        end: new Date('2024-05-12T11:00:00.000Z'),
        organizerId: 'alice',
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T10:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
    });

    it('should change the start of the webinar', async () => {
      await useCase.execute({
        webinarId: 'id-1',
        start: new Date('2024-05-12T08:00:00.000Z'),
        organizerId: 'alice',
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T08:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T11:00:00.000Z'));
    });

    it('should change the end of the webinar', async () => {
      await useCase.execute({
        webinarId: 'id-1',
        end: new Date('2024-05-12T12:00:00.000Z'),
        organizerId: 'alice',
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T10:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T12:00:00.000Z'));
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = {
      webinarId: 'id-2',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizerId: 'alice',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'Webinar not found.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    const payload = {
      webinarId: 'id-1',
      start: new Date('2024-05-12T10:00:00.000Z'),
      end: new Date('2024-05-12T11:00:00.000Z'),
      organizerId: 'bob',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'You are not allowed to modify this webinar.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar cannot happens too soon', () => {
    const payload = {
      webinarId: 'id-1',
      start: new Date('2024-04-28T10:00:00.000Z'),
      end: new Date('2024-04-28T12:00:00.000Z'),
      organizerId: 'alice',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'Webinar must happen in at least 3 days.',
      );

      shouldNotChangeDates();
    });
  });

  describe('Scenario: Webinar cannot end before it start', () => {
    const payload = {
      webinarId: 'id-1',
      start: new Date('2024-05-28T12:00:00.000Z'),
      end: new Date('2024-05-28T10:00:00.000Z'),
      organizerId: 'alice',
    };

    it('should fail', async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrow(
        'Webinar cannot end before it starts.',
      );

      shouldNotChangeDates();
    });
  });
});
