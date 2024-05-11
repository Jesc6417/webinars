import { Executable } from './../../../core';
import {
  WebinarCannotReduceNumberOfSeatsException,
  WebinarNotFoundException,
  WebinarTooManySeatsException,
  WebinarUpdateForbiddenException,
} from './../exceptions';
import { WebinarRepository } from './../ports';

type Request = { webinarId: string; seats: number; organizerId: string };
type Response = void;

export class ChangeSeats implements Executable<Request, Response> {
  constructor(private readonly webinarRepository: WebinarRepository) {}

  async execute(request: Request) {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(request.organizerId))
      throw new WebinarUpdateForbiddenException();

    if (webinar.hasLessSeats(request.seats))
      throw new WebinarCannotReduceNumberOfSeatsException();

    webinar.update({ seats: request.seats });

    if (webinar.hasTooManySeats()) throw new WebinarTooManySeatsException();

    await this.webinarRepository.update(webinar);
  }
}
