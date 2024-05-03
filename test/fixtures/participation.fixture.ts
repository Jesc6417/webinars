import {
  InMemoryParticipationRepository,
  Participation,
  ParticipationRepository,
} from '@/domain/webinars';
import { AppTest } from '../app-test';
import { Fixture } from './fixture';

export class ParticipationFixture extends Fixture<Participation> {
  constructor(public entity: Participation) {
    super();
  }

  async load(app: AppTest<Participation>): Promise<void> {
    const participationRepository: InMemoryParticipationRepository = app.get(
      ParticipationRepository,
    );

    participationRepository.database.push(this.entity);
  }

  async getById(app: AppTest<Participation>): Promise<string[]> {
    const participationRepository = app.get<InMemoryParticipationRepository>(
      ParticipationRepository,
    );

    return participationRepository.findUsersIds(this.entity.props.webinarId);
  }
}
