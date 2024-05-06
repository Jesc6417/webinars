import { Participation } from './../entities';
import { ParticipationRepository } from './../ports';

type Request = { participantId: string; webinarId: string };

export class InMemoryParticipationRepository extends ParticipationRepository {
  readonly database: Participation[] = [];

  async findParticipantsIds(webinarId: string): Promise<string[]> {
    return (await this.getParticipations(webinarId)).map(
      (participation) => participation.props.participantId,
    );
  }

  async deleteAllParticipations(webinarId: string): Promise<void> {
    const participations = await this.getParticipations(webinarId);

    participations.forEach((p) => {
      const index = this.database.findIndex(
        (participation) => participation.props.webinarId === p.props.webinarId,
      );
      this.database.splice(index, 1);
    });
  }

  async create({ webinarId, participantId }: Request): Promise<void> {
    this.database.push(new Participation({ webinarId, participantId }));
  }

  async isParticipationAlreadyExist(request: {
    webinarId: string;
    participantId: string;
  }): Promise<boolean> {
    return (
      (await this.getParticipations(request.webinarId)).filter(
        (participation) =>
          participation.props.participantId === request.participantId,
      ).length !== 0
    );
  }

  async countParticipations(webinarId: string): Promise<number> {
    return (await this.getParticipations(webinarId)).length;
  }

  private async getParticipations(webinarId: string): Promise<Participation[]> {
    return this.database.filter(
      (participation) => participation.props.webinarId === webinarId,
    );
  }

  async delete({ webinarId, participantId }: Request): Promise<void> {
    const position = this.database.findIndex(
      (p) =>
        p.props.participantId === participantId &&
        p.props.webinarId === webinarId,
    );

    if (position !== -1) {
      this.database.splice(position, 1);
    }
  }
}
