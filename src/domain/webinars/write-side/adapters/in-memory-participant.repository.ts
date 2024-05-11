import { Participant } from './../entities';
import { ParticipantRepository } from './../ports';

export class InMemoryParticipantRepository extends ParticipantRepository {
  readonly database: Participant[] = [];

  async getEmailById(participantId: string): Promise<string | undefined> {
    return this.database.find(
      (participant) => participant.props.id === participantId,
    )?.props.email;
  }
}
