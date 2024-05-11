import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WebinarQueryStore } from './ports';
import { WebinarNotFoundException } from './../../write-side/exceptions';

export class GetWebinarByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetWebinarByIdQuery)
export class GetWebinarByIdQueryHandler implements IQueryHandler {
  constructor(private readonly webinarQueryStore: WebinarQueryStore) {}

  async execute({ id }: GetWebinarByIdQuery) {
    const webinar = await this.webinarQueryStore.getWebinarById(id);

    if (!webinar) throw new WebinarNotFoundException();

    return webinar;
  }
}
