import { Organizer } from './../entities';
import { Executable } from './../../core';
import { WebinarRepository } from './../ports';

type Request = { webinarId: string; seats: number; organizer: Organizer };
type Response = void;

export class ChangeSeats implements Executable<Request, Response> {
  constructor(private readonly webinarRepository: WebinarRepository) {}

  async execute(request: Request) {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) throw new Error('Webinar not found.');

    if (!webinar.isCreator(request.organizer.props.id))
      throw new Error('You are not allowed to modify this webinar.');

    if (webinar.hasLessSeats(request.seats))
      throw new Error('You cannot reduce number of seats.');

    webinar.update({ seats: request.seats });

    if (webinar.hasTooManySeats())
      throw new Error('Webinar must have a maximum of 1000 seats.');

    await this.webinarRepository.update(webinar);
  }
}
