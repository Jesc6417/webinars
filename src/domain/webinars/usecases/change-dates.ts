import { Webinar } from './../entities';
import { format } from 'date-fns';
import { Mailer } from './../../core/mailer/ports/mailer';
import {
  ParticipationRepository,
  ParticipantRepository,
  WebinarRepository,
} from './../ports';
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
    private readonly participationRepository: ParticipationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly dateGenerator: DateProvider,
    private readonly mailer: Mailer,
  ) {}

  async execute(request: Request) {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) throw new Error('Webinar not found.');

    if (!webinar.isCreator(request.organizerId))
      throw new Error('You are not allowed to modify this webinar.');

    if (request.start) {
      webinar.update({ start: request.start });

      if (webinar.isTooSoon(this.dateGenerator.now()))
        throw new Error('Webinar must happen in at least 3 days.');
    }

    if (request.end) webinar.update({ end: request.end });

    if (webinar.endsBeforeStart())
      throw new Error('Webinar cannot end before it starts.');

    await this.webinarRepository.update(webinar!);
    await this.notifyParticipants(webinar);
  }

  private async notifyParticipants(webinar: Webinar) {
    const participantsIds = await this.getParticipantsIdsByWebinarId(
      webinar.props.id,
    );

    const bcc: string[] = await this.getEmailsParticipants(participantsIds);

    await this.mailer.sendEmail({
      bcc,
      subject: 'Webinar dates changed',
      body: `The webinar "${webinar.props.title}" has new dates: ${format(webinar.props.start, 'dd/MM/yyyy HH:mm')} - ${format(webinar.props.end, 'dd/MM/yyyy HH:mm')}.`,
    });
  }

  private async getParticipantsIdsByWebinarId(webinarId: string) {
    return this.participationRepository.findUsersIdsByWebinarId(webinarId);
  }

  private async getEmailsParticipants(
    participantsIds: string[],
  ): Promise<string[]> {
    return (await Promise.all(
      participantsIds
        .map((participationId) =>
          this.participantRepository.getEmailById(participationId),
        )
        .filter((user) => user !== null),
    )) as string[];
  }
}
