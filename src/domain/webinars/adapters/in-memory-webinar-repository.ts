import { Webinar } from '../entities/webinar';
import { WebinarRepository } from '../ports';

export class InMemoryWebinarRepository implements WebinarRepository {
  private readonly database: Webinar[] = [];

  async findById(id: string): Promise<Webinar | null> {
    return this.database.find((webinar) => webinar.props.id === id) || null;
  }

  create(webinar: Webinar) {
    this.database.push(webinar);

    return Promise.resolve();
  }
}
