import { Webinar } from '../entities';
import { WebinarRepository } from '../ports';

export class InMemoryWebinarRepository implements WebinarRepository {
  readonly database: Webinar[] = [];

  findByIdSync(id: string): Webinar | null {
    const webinar = this.database.find((webinar) => webinar.props.id === id);

    return webinar ? new Webinar({ ...webinar.initialState }) : null;
  }

  async findById(id: string): Promise<Webinar | null> {
    const webinar = this.database.find((webinar) => webinar.props.id === id);

    return webinar ? new Webinar({ ...webinar.initialState }) : null;
  }

  async create(webinar: Webinar) {
    this.database.push(webinar);
  }

  async update(webinar: Webinar) {
    const index = this.database.findIndex(
      (w) => w.props.id === webinar.props.id,
    );
    this.database[index] = webinar;

    webinar.commit();
  }

  async cancel(webinarId: string): Promise<void> {
    const index = this.database.findIndex((w) => w.props.id === webinarId);

    this.database.splice(index, 1);
  }
}
