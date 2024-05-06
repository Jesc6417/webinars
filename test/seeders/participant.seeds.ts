import { User } from '@/domain/users';
import { ParticipantFixture } from '../fixtures/participant.fixture';

export const e2eParticipants = {
  bob: new ParticipantFixture(
    new User({
      id: 'id-user-1',
      email: 'bob@gmail.com',
      token: 'token-user',
    }),
  ),
};
