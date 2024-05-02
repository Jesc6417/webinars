import {
  WebinarCannotEndBeforeStartsException,
  WebinarNotEnoughSeatException,
  WebinarTooEarlyException,
  WebinarTooManySeatsException,
} from './../exceptions';
import { WebinarRepository } from '../ports';
import { DateProvider, Executable, IdGenerator } from './../../core';
import { Organizer, Webinar } from './../entities';

type Request = {
  start: Date;
  end: Date;
  title: string;
  seats: number;
  organizer: Organizer;
};

type Response = {
  id: string;
};

export class OrganizeWebinar implements Executable<Request, Response> {
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly idGenerator: IdGenerator,
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
      organizer: request.organizer,
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
