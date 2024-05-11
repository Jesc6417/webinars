import { Participation } from '@/domain/webinars';
import { ParticipationFixture } from '../fixtures/participation.fixture';

export const e2eParticipations = {
  existingParticipations: new ParticipationFixture(
    new Participation({
      webinarId: 'id-webinar-1',
      participantId: 'id-user-1',
    }),
  ),
};
