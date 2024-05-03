import { Participant } from '@/domain/webinars';
import { ParticipantFixture } from '../fixtures/participant.fixture';

export const e2eParticipants = {
  bob: new ParticipantFixture(
    new Participant({
      id: 'id-user-1',
      email: 'bob@gmail.com',
    }),
  ),
};
