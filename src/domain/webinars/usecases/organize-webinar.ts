import { WebinarRepository } from '../ports';
import { DateGenerator, Executable, IdGenerator } from './../../core';
import { Webinar } from './../entities';

type Request = {
  start: Date;
  end: Date;
  title: string;
  seats: number;
  organizerId: string;
};

type Response = {
  id: string;
};

export class OrganizeWebinar implements Executable<Request, Response> {
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly idGenerator: IdGenerator,
    private readonly dateGenerator: DateGenerator,
  ) {}

  async execute(request: Request) {
    const id = this.idGenerator.generate();
    const webinar = new Webinar({
      id,
      title: request.title,
      seats: request.seats,
      start: request.start,
      end: request.end,
      organizerId: request.organizerId,
    });

    if (webinar.isTooSoon(this.dateGenerator.now()))
      throw new Error('Webinar must happen in at least 3 days.');

    if (webinar.hasTooManySeats())
      throw new Error('Webinar must have a maximum of 1000 seats.');

    if (webinar.hasNoSeats())
      throw new Error('Webinar must have at least 1 seat.');

    await this.webinarRepository.create(webinar);

    return { id };
  }
}
