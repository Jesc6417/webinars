import { Organizer, Participant, Participation, Webinar } from './../entities';

export namespace WebinarSeeds {
  export const existingWebinar = new Webinar({
    id: 'id-1',
    title: 'My first webinar',
    seats: 100,
    start: new Date('2024-05-12T10:00:00.000Z'),
    end: new Date('2024-05-12T11:00:00.000Z'),
    organizer: new Organizer({ id: 'alice' }),
  });

  export const OrganizerAlice = new Organizer({ id: 'alice' });
  export const OrganizerBob = new Organizer({ id: 'bob' });

  export const existingParticipation = [
    new Participation({
      webinarId: existingWebinar.props.id,
      participantId: 'participant-1',
    }),
    new Participation({
      webinarId: existingWebinar.props.id,
      participantId: 'participant-2',
    }),
    new Participation({
      webinarId: 'id-2',
      participantId: 'participant-3',
    }),
  ];

  export const existingParticipant = [
    new Participant({
      id: 'bob',
      email: 'bob@gmail.com',
    }),
    new Participant({
      id: 'participant-1',
      email: 'participant-1@gmail.com',
    }),
    new Participant({
      id: 'participant-2',
      email: 'participant-2@gmail.com',
    }),
    new Participant({
      id: 'participant-3',
      email: 'participant-3@gmail.com',
    }),
  ];
}
