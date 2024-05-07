import { DateProvider, IdProvider } from '@/domain/core';
import { CurrentDateProvider, UuidProvider } from '@/infrastructure/providers';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: IdProvider,
      useClass: UuidProvider,
    },
    {
      provide: DateProvider,
      useClass: CurrentDateProvider,
    },
  ],
  exports: [IdProvider, DateProvider],
})
export class ProvidersModule {}
