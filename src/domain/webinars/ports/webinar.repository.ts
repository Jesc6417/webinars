import { Webinar } from '../entities/webinar';

export abstract class WebinarRepository {
  abstract findById(id: string): Promise<Webinar | null>;

  abstract create(webinar: Webinar): Promise<void>;
}
