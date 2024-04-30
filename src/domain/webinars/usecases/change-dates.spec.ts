import { Webinar } from './../entities';
import { InMemoryWebinarRepository } from './../adapters';
import { ChangeDates } from './change-dates';

describe('Feature: Change webinars dates', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeDates;

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository();
    useCase = new ChangeDates(webinarRepository);

    webinarRepository.database.push(
      new Webinar({
        id: 'id-1',
        title: 'My first webinar',
        seats: 100,
        start: new Date('2024-05-12T09:00:00.000Z'),
        end: new Date('2024-05-12T10:00:00.000Z'),
        organizerId: 'alice',
      }),
    );
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
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T10:00:00.000Z'));
    });

    it('should change the end of the webinar', async () => {
      await useCase.execute({
        webinarId: 'id-1',
        end: new Date('2024-05-12T12:00:00.000Z'),
        organizerId: 'alice',
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar!.props.start).toEqual(
        new Date('2024-05-12T09:00:00.000Z'),
      );
      expect(webinar!.props.end).toEqual(new Date('2024-05-12T12:00:00.000Z'));
    });
  });

  describe('Scenario: Webinar not found', () => {
    it('should fail', async () => {
      expect(
        async () =>
          await useCase.execute({
            webinarId: 'id-2',
            start: new Date('2024-05-12T10:00:00.000Z'),
            end: new Date('2024-05-12T11:00:00.000Z'),
            organizerId: 'alice',
          }),
      ).rejects.toThrow('Webinar not found.');
    });
  });

  describe('Scenario: Webinar can only be modified by the creator', () => {
    it('should fail', async () => {
      expect(
        async () =>
          await useCase.execute({
            webinarId: 'id-1',
            start: new Date('2024-05-12T10:00:00.000Z'),
            end: new Date('2024-05-12T11:00:00.000Z'),
            organizerId: 'bob',
          }),
      ).rejects.toThrow('You are not allowed to modify this webinar.');
    });
  });
});
