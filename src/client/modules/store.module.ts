import {
  InMemoryWebinarQueryStore,
  WebinarQueryStore,
} from '@/domain/webinars';
import { CacheWebinarQueryStore } from '@/infrastructure/cache-manager';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: WebinarQueryStore,
      inject: [CACHE_MANAGER],
      useFactory: (cacheManager: Cache) =>
        new CacheWebinarQueryStore(cacheManager),
    },
  ],
  exports: [WebinarQueryStore],
})
export class StoreProxyModule {}
