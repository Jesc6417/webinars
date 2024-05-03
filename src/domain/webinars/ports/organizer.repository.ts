export abstract class OrganizerRepository {
  abstract findEmail(organizerId: string): Promise<string | undefined>;
}
