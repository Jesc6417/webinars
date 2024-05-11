import { WebinarQueryStore } from '@/domain/webinars';
import { CacheWebinarQueryStore } from './cache-webinar.query-store';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { addDays } from 'date-fns';
import { AppTest } from '../../../test/app-test';

describe('WebinarCache', () => {
  let app: AppTest;
  let webinarCache: CacheWebinarQueryStore;
  let cacheManager: Cache;

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    webinarCache = app.get(WebinarQueryStore);
    cacheManager = app.get(CACHE_MANAGER);
  });

  describe('Scenario: get webinar from cache', () => {
    it('should get the webinar from the cache', async () => {
      const start = addDays(new Date(), 5);
      const end = addDays(new Date(), 6);

      await cacheManager.set('id-webinar-1', {
        id: 'id-webinar-1',
        title: 'My first webinar',
        start,
        end,
        organizer: {
          id: 'id-user-1',
          name: 'juliette@gmail.com',
        },
        seats: {
          available: 100,
          reserved: 0,
        },
      });

      const webinarById = await webinarCache.getWebinarById('id-webinar-1');

      expect(webinarById).toEqual({
        id: 'id-webinar-1',
        title: 'My first webinar',
        start,
        end,
        organizer: {
          id: 'id-user-1',
          name: 'juliette@gmail.com',
        },
        seats: {
          available: 100,
          reserved: 0,
        },
      });
    });
  });
});
