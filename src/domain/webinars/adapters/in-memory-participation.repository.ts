import { Participation } from './../entities';
import { ParticipationRepository } from './../ports';

export class InMemoryParticipationRepository extends ParticipationRepository {
  readonly database: Participation[] = [];

  async findUsersIdsByWebinarId(webinarId: string): Promise<string[]> {
    return this.database
      .filter((participation) => participation.props.webinarId === webinarId)
      .map((participation) => participation.props.participantId);
  }

  async deleteByWebinarId(webinarId: string): Promise<void> {
    const participations = this.database.filter(
      (p) => p.props.webinarId === webinarId,
    );

    participations.forEach((p) => {
      const index = this.database.findIndex(
        (participation) => participation.props.webinarId === p.props.webinarId,
      );
      this.database.splice(index, 1);
    });
  }
}
