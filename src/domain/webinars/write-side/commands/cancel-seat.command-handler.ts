import { ReserveSeatCommand } from '@/domain/webinars';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Mailer } from './../../../core';
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

export class CancelSeatCommand implements ICommand {
  constructor(
    public readonly webinarId: string,
    public readonly participantId: string,
  ) {}
}

@CommandHandler(CancelSeatCommand)
export class CancelSeatCommandHandler
  implements ICommandHandler<CancelSeatCommand, void>
{
  constructor(
    private readonly participationRepository: ParticipationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly webinarRepository: WebinarRepository,
    private readonly organizerRepository: OrganizerRepository,
    private readonly mailer: Mailer,
  ) {}

  async execute(command: CancelSeatCommand) {
    const webinar = await this.webinarRepository.findById(command.webinarId);

    const emailParticipant = await this.participantRepository.getEmailById(
      command.participantId,
    );

    if (!emailParticipant) throw new ParticipantNotFoundException();

    await this.assertParticipantExist(command);

    await this.participationRepository.delete(command);

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

  private async assertParticipantExist(command: CancelSeatCommand) {
    const participationExists =
      await this.participationRepository.isParticipationAlreadyExist(command);

    if (!participationExists) throw new ParticipationNotFoundException();
  }
}
