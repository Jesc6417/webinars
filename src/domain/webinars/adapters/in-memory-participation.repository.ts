import { Participation } from './../entities/participation';
import { ParticipationRepository } from './../ports';

export class InMemoryParticipationRepository extends ParticipationRepository {
  database: Participation[] = [];

  async findUsersIdsByWebinarId(webinarId: string): Promise<string[]> {
    return this.database
      .filter((participation) => participation.props.webinarId === webinarId)
      .map((participation) => participation.props.userId);
  }
}
