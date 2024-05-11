import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { WebinarRepository } from '../ports';
import { DateProvider, IdProvider } from './../../../core';
import { Webinar } from './../entities';
import {
  WebinarCannotEndBeforeStartsException,
  WebinarNotEnoughSeatException,
  WebinarTooEarlyException,
  WebinarTooManySeatsException,
} from './../exceptions';

type Response = {
  id: string;
};

export class OrganizeWebinarCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly seats: number,
    public readonly start: Date,
    public readonly end: Date,
    public readonly organizerId: string,
  ) {}
}

@CommandHandler(OrganizeWebinarCommand)
export class OrganizeWebinarCommandHandler
  implements ICommandHandler<OrganizeWebinarCommand, Response>
{
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly idGenerator: IdProvider,
    private readonly dateGenerator: DateProvider,
  ) {}

  async execute(command: OrganizeWebinarCommand) {
    const id = this.idGenerator.generate();
    const webinar = new Webinar({
      id,
      title: command.title,
      seats: command.seats,
      start: command.start,
      end: command.end,
      organizerId: command.organizerId,
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
