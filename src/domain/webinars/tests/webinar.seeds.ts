import { Webinar } from './../entities';

export namespace WebinarSeeds {
  export const myFirstWebinar = {
    title: 'My first webinar',
    seats: 100,
    start: new Date('2024-05-12T10:00:00.000Z'),
    end: new Date('2024-05-12T11:00:00.000Z'),
    organizerId: 'alice',
  };
  export const existingWebinar = new Webinar({
    ...myFirstWebinar,
    id: 'id-1',
  });
}
