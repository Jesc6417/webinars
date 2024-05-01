import { WebinarRepository } from './../ports';
import { DateProvider, Executable } from './../../core';

type Request = {
  start?: Date;
  end?: Date;
  webinarId: string;
  organizerId: string;
};

type Response = void;

export class ChangeDates implements Executable<Request, Response> {
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly dateGenerator: DateProvider,
  ) {}

  async execute(request: Request) {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) throw new Error('Webinar not found.');

    if (!webinar.isCreator(request.organizerId))
      throw new Error('You are not allowed to modify this webinar.');

    if (request.start) webinar?.update({ start: request.start });

    if (webinar.isTooSoon(this.dateGenerator.now()))
      throw new Error('Webinar must happen in at least 3 days.');

    if (request.end) webinar?.update({ end: request.end });

    if (webinar.endsBeforeStart())
      throw new Error('Webinar cannot end before it starts.');

    await this.webinarRepository.update(webinar!);
  }
}
