import { DateGenerator, IdGenerator } from '@/domain/core';
import { User, Webinar } from './../entities';
import { WebinarRepository } from '../ports';

export class OrganizeWebinar {
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly idGenerator: IdGenerator,
    private readonly dateGenerator: DateGenerator,
  ) {}

  async execute(data: {
    start: Date;
    end: Date;
    title: string;
    seats: number;
    user: User;
  }) {
    const id = this.idGenerator.generate();
    const webinar = new Webinar({
      id,
      title: data.title,
      seats: data.seats,
      start: data.start,
      end: data.end,
      organizerId: data.user.props.id,
    });

    if (webinar.isTooSoon(this.dateGenerator.now()))
      throw new Error('Webinar must happen in at least 3 days.');

    if (webinar.hasTooManySeats())
      throw new Error('Webinar must have a maximum of 1000 seats.');

    if (webinar.hasNoSeats())
      throw new Error('Webinar must have at least 1 seat.');

    await this.webinarRepository.create(webinar);

    return Promise.resolve({ id });
  }
}
