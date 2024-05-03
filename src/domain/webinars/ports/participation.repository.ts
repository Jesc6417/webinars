export abstract class ParticipationRepository {
  abstract findUsersIds(webinarId: string): Promise<string[]>;

  abstract deleteAllParticipations(webinarId: string): Promise<void>;

  abstract create(request: {
    participantId: string;
    webinarId: string;
  }): Promise<void>;

  abstract isParticipationAlreadyExist(request: {
    participantId: string;
    webinarId: string;
  }): Promise<boolean>;

  abstract countParticipations(webinarId: string): Promise<number>;

  abstract delete(request: {
    participantId: string;
    webinarId: string;
  }): Promise<void>;
}
