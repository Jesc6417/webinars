import { DateProvider, IdGenerator } from '@/domain/core';
import { CurrentDateProvider, UuidProvider } from '@/infrastructure/providers';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: IdGenerator,
      useClass: UuidProvider,
    },
    {
      provide: DateProvider,
      useClass: CurrentDateProvider,
    },
  ],
  exports: [IdGenerator, DateProvider],
})
export class ProvidersModule {}
