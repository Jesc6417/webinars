import { WebinarRepository } from '../ports';
import { DateProvider, Executable, IdProvider } from './../../core';
import { Webinar } from './../entities';
import {
  WebinarCannotEndBeforeStartsException,
  WebinarNotEnoughSeatException,
  WebinarTooEarlyException,
  WebinarTooManySeatsException,
} from './../exceptions';

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
    private readonly idGenerator: IdProvider,
    private readonly dateGenerator: DateProvider,
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
      throw new WebinarTooEarlyException();

    if (webinar.hasTooManySeats()) throw new WebinarTooManySeatsException();

    if (webinar.hasNoSeats()) throw new WebinarNotEnoughSeatException();

    if (webinar.endsBeforeStart())
      throw new WebinarCannotEndBeforeStartsException();

    await this.webinarRepository.create(webinar);

    return { id };
  }
}
