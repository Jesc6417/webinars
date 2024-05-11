import { WebinarDto, WebinarQueryStore } from '@/domain/webinars';
import { Cache } from '@nestjs/cache-manager';

export class CacheWebinarQueryStore extends WebinarQueryStore {
  constructor(private cacheManager: Cache) {
    super();
  }

  storeWebinarById = async (
    webinarId: string,
    webinar: WebinarDto,
  ): Promise<void> => await this.cacheManager.set(webinarId, webinar);

  getWebinarById = async (webinarId: string): Promise<WebinarDto> =>
    (await this.cacheManager.get(webinarId)) as WebinarDto;
}
