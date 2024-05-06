import { Executable, Mailer } from './../../core';
import {
  WebinarDeleteForbiddenException,
  WebinarNotFoundException,
} from './../exceptions';
import {
  ParticipantRepository,
  ParticipationRepository,
  WebinarRepository,
} from './../ports';

type Request = { webinarId: string; organizerId: string };

export class CancelWebinar implements Executable<Request, void> {
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly participationRepository: ParticipationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly mailer: Mailer,
  ) {}

  async execute(request: Request): Promise<void> {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(request.organizerId))
      throw new WebinarDeleteForbiddenException();

    const participantsIds =
      await this.participationRepository.findParticipantsIds(request.webinarId);

    const bcc = (await Promise.all(
      participantsIds
        .map((userId) => this.participantRepository.getEmailById(userId))
        .filter((email) => !!email),
    )) as string[];

    await this.mailer.sendEmail({
      bcc,
      subject: `Webinar "${webinar.props.title}" canceled`,
      body: `The webinar "${webinar.props.title}" has been canceled.`,
    });

    await this.participationRepository.deleteAllParticipations(
      request.webinarId,
    );
    await this.webinarRepository.cancel(request.webinarId);
  }
}
