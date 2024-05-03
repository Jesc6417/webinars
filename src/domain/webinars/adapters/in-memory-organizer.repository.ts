import { Organizer } from './../entities';
import { OrganizerRepository } from './../ports';

export class InMemoryOrganizerRepository extends OrganizerRepository {
  readonly database: Organizer[] = [];

  async findEmail(organizerId: string): Promise<string | undefined> {
    const organizer = this.database.find(
      (organizer) => organizer.props.id === organizerId,
    );

    return organizer?.props.email;
  }
}
