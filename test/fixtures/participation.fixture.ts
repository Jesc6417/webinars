import {
  InMemoryParticipationRepository,
  Participation,
  ParticipationRepository,
} from '@/domain/webinars';
import { AppTest } from '../app-test';
import { Fixture } from './fixture';

export class ParticipationFixture extends Fixture {
  constructor(public entity: Participation) {
    super();
  }

  async load(app: AppTest): Promise<void> {
    const participationRepository: InMemoryParticipationRepository = app.get(
      ParticipationRepository,
    );

    await participationRepository.create(this.entity.props);
  }

  async getById(app: AppTest): Promise<string[]> {
    const participationRepository = app.get<InMemoryParticipationRepository>(
      ParticipationRepository,
    );

    return participationRepository.findParticipantsIds(
      this.entity.props.webinarId,
    );
  }
}
