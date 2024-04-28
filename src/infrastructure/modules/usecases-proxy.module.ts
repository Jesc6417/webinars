import { DateGenerator, IdGenerator } from '@/domain/core';
import { CurrentDateGenerator } from '@/infrastructure/generators/current-date.generator';
import { Module } from '@nestjs/common';
import {
  InMemoryWebinarRepository,
  OrganizeWebinar,
  WebinarRepository,
} from '@/domain/webinars';
import { UuidGenerator } from '../generators/uuid.generator';

@Module({
  imports: [],
})
export class UsecasesProxyModule {
  static register() {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          provide: WebinarRepository,
          useClass: InMemoryWebinarRepository,
        },
        {
          provide: IdGenerator,
          useClass: UuidGenerator,
        },
        {
          provide: DateGenerator,
          useClass: CurrentDateGenerator,
        },
        {
          provide: OrganizeWebinar,
          useFactory: (
            webinarRepository: WebinarRepository,
            idGenerator: IdGenerator,
            dateGenerator: DateGenerator,
          ) =>
            new OrganizeWebinar(webinarRepository, idGenerator, dateGenerator),
          inject: [WebinarRepository, IdGenerator, DateGenerator],
        },
      ],
      exports: [OrganizeWebinar],
    };
  }
}
