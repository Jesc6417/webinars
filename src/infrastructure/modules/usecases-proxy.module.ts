import { IdGenerator } from '@/domain/core';
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
          provide: OrganizeWebinar,
          useFactory: (
            webinarRepository: WebinarRepository,
            idGenerator: IdGenerator,
          ) => new OrganizeWebinar(webinarRepository, idGenerator),
          inject: [WebinarRepository, IdGenerator],
        },
      ],
      exports: [OrganizeWebinar],
    };
  }
}
