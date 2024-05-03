import {
  InMemoryParticipantRepository,
  Participant,
  ParticipantRepository,
  Participation,
} from '@/domain/webinars';
import { AppTest } from '../app-test';
import { Fixture } from './fixture';

export class ParticipantFixture extends Fixture<Participant> {
  constructor(public entity: Participant) {
    super();
  }

  async load(app: AppTest<Participation>): Promise<void> {
    const participantRepository: InMemoryParticipantRepository = app.get(
      ParticipantRepository,
    );

    participantRepository.database.push(this.entity);
  }
}
