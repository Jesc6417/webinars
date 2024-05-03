import { Webinar } from '@/domain/webinars';
import { Mailer } from './../../core';
import {
  ParticipantAlreadyRegisteredException,
  ParticipantNotFoundException,
  WebinarNoMoreSeatsAvailableException,
  WebinarNotFoundException,
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

export class ReserveSeat {
  constructor(
    private readonly participationRepository: ParticipationRepository,
    private readonly webinarRepository: WebinarRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly organizerRepository: OrganizerRepository,
    private readonly mailer: Mailer,
  ) {}

  async execute({ webinarId, participantId }: Request) {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    const emailParticipant =
      await this.participantRepository.getEmailById(participantId);

    if (!emailParticipant) throw new ParticipantNotFoundException();

    await this.assertParticipantNotAlreadyRegistered(webinarId, participantId);
    await this.assertHasSeatsAvailable(webinar);

    await this.participationRepository.create({ webinarId, participantId });

    await this.sendEmailToParticipant(emailParticipant, webinar.props.title);

    await this.sendEmailToOrganizer(webinar);
  }

  private async sendEmailToOrganizer(webinar: Webinar) {
    const emailOrganizer = await this.organizerRepository.findEmail(
      webinar.props.organizerId,
    );

    await this.mailer.sendEmail({
      to: emailOrganizer,
      subject: `New reservation for webinar "${webinar.props.title}"`,
      body: `A new participant has reserved a seat for the webinar "${webinar.props.title}".`,
    });
  }

  private async sendEmailToParticipant(to: string, title: string) {
    await this.mailer.sendEmail({
      to,
      subject: `Reservation for webinar "${title}"`,
      body: `You have successfully reserved a seat for the webinar "${title}".`,
    });
  }

  private async assertParticipantNotAlreadyRegistered(
    webinarId: string,
    participantId: string,
  ) {
    const isAlreadyRegistered =
      await this.participationRepository.isParticipationAlreadyExist({
        webinarId,
        participantId,
      });

    if (isAlreadyRegistered) throw new ParticipantAlreadyRegisteredException();
  }

  private async assertHasSeatsAvailable(webinar: Webinar) {
    const participantsCount =
      await this.participationRepository.countParticipations(webinar.props.id);

    if (webinar.hasNotEnoughSeats(participantsCount))
      throw new WebinarNoMoreSeatsAvailableException();
  }
}
