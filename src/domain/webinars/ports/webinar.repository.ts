import { Webinar } from '../entities';

export abstract class WebinarRepository {
  abstract findById(id: string): Promise<Webinar | null>;

  abstract create(webinar: Webinar): Promise<void>;

  abstract update(webinar: Webinar): Promise<void>;

  abstract cancel(webinarId: string): Promise<void>;
}
