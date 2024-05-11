import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
  WebinarCannotReduceNumberOfSeatsException,
  WebinarNotFoundException,
  WebinarTooManySeatsException,
  WebinarUpdateForbiddenException,
} from './../exceptions';
import { WebinarRepository } from './../ports';

type Response = void;

export class ChangeSeatsCommand implements ICommand {
  constructor(
    public readonly webinarId: string,
    public readonly seats: number,
    public readonly organizerId: string,
  ) {}
}

@CommandHandler(ChangeSeatsCommand)
export class ChangeSeatsCommandHandler
  implements ICommandHandler<ChangeSeatsCommand, Response>
{
  constructor(private readonly webinarRepository: WebinarRepository) {}

  async execute(command: ChangeSeatsCommand) {
    const webinar = await this.webinarRepository.findById(command.webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(command.organizerId))
      throw new WebinarUpdateForbiddenException();

    if (webinar.hasLessSeats(command.seats))
      throw new WebinarCannotReduceNumberOfSeatsException();

    webinar.update({ seats: command.seats });

    if (webinar.hasTooManySeats()) throw new WebinarTooManySeatsException();

    await this.webinarRepository.update(webinar);
  }
}
