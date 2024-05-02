export abstract class ParticipationRepository {
  abstract findUsersIdsByWebinarId(webinarId: string): Promise<string[]>;
}
