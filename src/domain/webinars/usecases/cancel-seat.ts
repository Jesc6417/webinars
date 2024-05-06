import { Executable, Mailer } from './../../core';
import { Webinar } from './../entities';
import {
  ParticipantNotFoundException,
  ParticipationNotFoundException,
} from './../exceptions';
import {
  OrganizerRepository,
  ParticipantRepository,
  ParticipationRepository,
  WebinarRepository,
} from './../ports';

type Request = {
  webinarId: string;
  participantId: string;
};

export class CancelSeat implements Executable<Request, void> {
  constructor(
    private readonly participationRepository: ParticipationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly webinarRepository: WebinarRepository,
    private readonly organizerRepository: OrganizerRepository,
    private readonly mailer: Mailer,
  ) {}

  async execute(request: Request) {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    const emailParticipant = await this.participantRepository.getEmailById(
      request.participantId,
    );

    if (!emailParticipant) throw new ParticipantNotFoundException();

    await this.assertParticipantExist(request);

    await this.participationRepository.delete(request);

    await this.sendEmailToParticipant(emailParticipant, webinar!.props.title);
    await this.sendEmailToOrganizer(webinar!, emailParticipant);
  }

  private async sendEmailToParticipant(to: string, title: string) {
    await this.mailer.sendEmail({
      to,
      subject: `Webinar reservation canceled`,
      body: `Your reservation for the webinar "${title}" has been canceled.`,
    });
  }

  private async sendEmailToOrganizer(
    webinar: Webinar,
    emailParticipant: string,
  ) {
    const emailOrganizer = await this.organizerRepository.findEmail(
      webinar.props.organizerId,
    );

    await this.mailer.sendEmail({
      to: emailOrganizer,
      subject: 'Participant canceled reservation',
      body: `The participant "${emailParticipant}" has canceled the reservation for the webinar "${webinar.props.title}".`,
    });
  }

  private async assertParticipantExist(request: Request) {
    const participationExists =
      await this.participationRepository.isParticipationAlreadyExist(request);

    if (!participationExists) throw new ParticipationNotFoundException();
  }
}
