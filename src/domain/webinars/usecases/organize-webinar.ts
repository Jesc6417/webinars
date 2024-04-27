import { IdGenerator } from '@/domain/core';
import { differenceInDays } from 'date-fns';
import { Webinar } from '../entities/webinar';
import { WebinarRepository } from '../ports';

export class OrganizeWebinar {
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  execute(data: { start: Date; end: Date; title: string; seats: number }) {
    const id = this.idGenerator.generate();
    const webinar = new Webinar({
      id,
      title: data.title,
      seats: data.seats,
      start: data.start,
      end: data.end,
    });

    if (webinar.isTooSoon(new Date()))
      throw new Error('Webinar must happen in at least 3 days.');

    this.webinarRepository.create(webinar);

    return { id };
  }
}
