import { Organizer, Webinar } from './../entities';

export namespace WebinarSeeds {
  export const existingWebinar = new Webinar({
    id: 'id-1',
    title: 'My first webinar',
    seats: 100,
    start: new Date('2024-05-12T10:00:00.000Z'),
    end: new Date('2024-05-12T11:00:00.000Z'),
    organizer: new Organizer({ id: 'alice' }),
  });
}
