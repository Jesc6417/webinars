import { InMemoryWebinarQueryStore } from './adapters';
import {
  StubOrganizerBuilder,
  StubWebinarBuilder,
} from './../../write-side/entities/builders';
import { GetWebinarByIdQueryHandler } from './get-webinar-by-id-query-handler';

describe('Feature: Get webinar', () => {
  let webinarQueryStore: InMemoryWebinarQueryStore;
  let getWebinarById: GetWebinarByIdQueryHandler;
  const nodeJsWebinar = new StubWebinarBuilder().build();
  const julietteOrganizer = new StubOrganizerBuilder().build();

  beforeEach(async () => {
    webinarQueryStore = new InMemoryWebinarQueryStore();
    getWebinarById = new GetWebinarByIdQueryHandler(webinarQueryStore);

    await webinarQueryStore.storeWebinarById(nodeJsWebinar.props.id, {
      id: nodeJsWebinar.props.id,
      title: nodeJsWebinar.props.title,
      start: nodeJsWebinar.props.start,
      end: nodeJsWebinar.props.end,
      organizer: {
        id: julietteOrganizer.props.id,
        email: julietteOrganizer.props.email,
      },
      seats: {
        reserved: 1,
        available: 99,
      },
    });
  });

  describe('Scenario: Get webinar given an id', () => {
    it('should succeed', async () => {
      const result = await getWebinarById.execute({
        id: nodeJsWebinar.props.id,
      });

      expect(result).toEqual({
        id: nodeJsWebinar.props.id,
        title: nodeJsWebinar.props.title,
        start: nodeJsWebinar.props.start,
        end: nodeJsWebinar.props.end,
        organizer: {
          id: julietteOrganizer.props.id,
          email: julietteOrganizer.props.email,
        },
        seats: {
          reserved: 1,
          available: 99,
        },
      });
    });
  });

  describe('Scenario: Webinar not found', () => {
    it('should throw an error "Webinar not found."', async () => {
      await expect(
        getWebinarById.execute({ id: 'unknown-id' }),
      ).rejects.toThrow('Webinar not found.');
    });
  });
});
