export abstract class ParticipantRepository {
  abstract getEmailById(userId: string): Promise<string | undefined>;
}
