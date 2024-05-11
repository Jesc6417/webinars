import { WebinarDto } from '../dto';

export abstract class WebinarQueryStore {
  abstract storeWebinarById(
    webinarId: string,
    webinar: WebinarDto,
  ): Promise<void>;

  abstract getWebinarById(webinarId: string): Promise<WebinarDto | null>;
}
