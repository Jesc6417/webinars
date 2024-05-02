export abstract class ParticipationRepository {
  abstract findUsersIdsByWebinarId(webinarId: string): Promise<string[]>;

  abstract deleteByWebinarId(webinarId: string): Promise<void>;
}
