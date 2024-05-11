import {
  InMemoryOrganizerRepository,
  InMemoryParticipationRepository,
  InMemoryWebinarRepository,
} from './../adapters';
import {
  StubOrganizerBuilder,
  StubParticipationBuilder,
  StubWebinarBuilder,
} from './../entities/builders';
import { WebinarByIdQueryStore } from './webinar-by-id.query-store';
import { InMemoryWebinarQueryStore } from '../../read-side/queries/adapters/in-memory-webinar.query-store';

describe('WebinarQueryStore', () => {
  let webinarQueryStore: InMemoryWebinarQueryStore;
  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let organizerRepository: InMemoryOrganizerRepository;
  let webinarByIdQueryStore: WebinarByIdQueryStore;
  const nodejsWebinar = new StubWebinarBuilder().build();
  const nodejsOrganizer = new StubOrganizerBuilder().build();
  const nodejsParticipation = new StubParticipationBuilder().build();

  beforeEach(async () => {
    webinarQueryStore = new InMemoryWebinarQueryStore();
    webinarRepository = new InMemoryWebinarRepository();
    participationRepository = new InMemoryParticipationRepository();
    organizerRepository = new InMemoryOrganizerRepository();
    webinarByIdQueryStore = new WebinarByIdQueryStore(
      webinarQueryStore,
      webinarRepository,
      organizerRepository,
      participationRepository,
    );

    webinarRepository.database.push(nodejsWebinar);
    organizerRepository.database.push(nodejsOrganizer);
    participationRepository.database.push(nodejsParticipation);
  });

  describe('Scenario: Store webinar by id', () => {
    it('should succeed', async () => {
      await webinarByIdQueryStore.store(nodejsWebinar.props.id);

      expect(webinarQueryStore.database[nodejsWebinar.props.id]).toEqual({
        id: nodejsWebinar.props.id,
        title: nodejsWebinar.props.title,
        start: nodejsWebinar.props.start,
        end: nodejsWebinar.props.end,
        organizer: {
          id: nodejsOrganizer.props.id,
          email: nodejsOrganizer.props.email,
        },
        seats: {
          reserved: 1,
          available: 99,
        },
      });
    });
  });
});
