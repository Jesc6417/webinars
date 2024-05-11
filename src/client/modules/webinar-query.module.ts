import {
  GetWebinarByIdQueryHandler,
  WebinarQueryStore,
} from '@/domain/webinars';
import { Module } from '@nestjs/common';
import { StoreProxyModule } from './store.module';

@Module({
  imports: [StoreProxyModule],
  providers: [
    {
      provide: GetWebinarByIdQueryHandler,
      inject: [WebinarQueryStore],
      useFactory: (webinarQueryStore: WebinarQueryStore) =>
        new GetWebinarByIdQueryHandler(webinarQueryStore),
    },
  ],
  exports: [GetWebinarByIdQueryHandler],
})
export class WebinarQueryModule {}
