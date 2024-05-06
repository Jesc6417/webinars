import {
  InMemoryWebinarRepository,
  Webinar,
  WebinarRepository,
} from '@/domain/webinars';
import { AppTest } from '../app-test';
import { Fixture } from './fixture';

export class WebinarFixture extends Fixture {
  constructor(public entity: Webinar) {
    super();
  }

  async load(app: AppTest): Promise<void> {
    const webinarRepository: InMemoryWebinarRepository =
      app.get(WebinarRepository);

    await webinarRepository.create(this.entity);
  }

  async getById(app: AppTest): Promise<Webinar | null> {
    const webinarRepository: InMemoryWebinarRepository =
      app.get(WebinarRepository);

    return webinarRepository.findById(this.entity.props.id);
  }
}
