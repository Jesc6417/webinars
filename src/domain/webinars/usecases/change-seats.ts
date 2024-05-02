import {
  WebinarNotFoundException,
  WebinarUpdateForbiddenException,
  WebinarCannotEndBeforeStartsException,
  WebinarTooManySeatsException,
  WebinarCannotReduceNumberOfSeatsException,
} from './../exceptions';
import { Organizer } from './../entities';
import { Executable } from './../../core';
import { WebinarRepository } from './../ports';

type Request = { webinarId: string; seats: number; organizer: Organizer };
type Response = void;

export class ChangeSeats implements Executable<Request, Response> {
  constructor(private readonly webinarRepository: WebinarRepository) {}

  async execute(request: Request) {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(request.organizer.props.id))
      throw new WebinarUpdateForbiddenException();

    if (webinar.hasLessSeats(request.seats))
      throw new WebinarCannotReduceNumberOfSeatsException();

    webinar.update({ seats: request.seats });

    if (webinar.hasTooManySeats()) throw new WebinarTooManySeatsException();

    await this.webinarRepository.update(webinar);
  }
}
