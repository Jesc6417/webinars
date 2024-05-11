import { WebinarDto } from '../dto';
import { WebinarQueryStore } from '../../../write-side/ports';

export class InMemoryWebinarQueryStore extends WebinarQueryStore {
  database: Record<string, WebinarDto> = {};

  async storeWebinarById(
    webinarId: string,
    webinar: WebinarDto,
  ): Promise<void> {
    this.database[webinarId] = webinar;
  }

  getWebinarById = async (webinarId: string): Promise<WebinarDto | null> =>
    this.database[webinarId] || null;
}
