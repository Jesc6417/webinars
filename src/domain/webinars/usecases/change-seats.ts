import { WebinarRepository } from '@/domain/webinars';

type Request = { webinarId: string; seats: number; organizerId: string };

export class ChangeSeats {
  constructor(private readonly webinarRepository: WebinarRepository) {}

  async execute(request: Request) {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) throw new Error('Webinar not found.');

    if (!webinar.isCreator(request.organizerId))
      throw new Error('You are not allowed to modify this webinar.');

    if (webinar.hasLessSeats(request.seats))
      throw new Error('You cannot reduce number of seats.');

    webinar.update({ seats: request.seats });

    if (webinar.hasTooManySeats())
      throw new Error('Webinar must have a maximum of 1000 seats.');

    await this.webinarRepository.update(webinar);
  }
}
