import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Executable, Mailer } from './../../../core';
import {
  WebinarDeleteForbiddenException,
  WebinarNotFoundException,
} from './../exceptions';
import {
  ParticipantRepository,
  ParticipationRepository,
  WebinarRepository,
} from './../ports';

export class CancelWebinarCommand implements ICommand {
  constructor(
    public readonly webinarId: string,
    public readonly organizerId: string,
  ) {}
}

@CommandHandler(CancelWebinarCommand)
export class CancelWebinarCommandHandler
  implements ICommandHandler<CancelWebinarCommand, void>
{
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly participationRepository: ParticipationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly mailer: Mailer,
  ) {}

  async execute(command: CancelWebinarCommand): Promise<void> {
    const webinar = await this.webinarRepository.findById(command.webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(command.organizerId))
      throw new WebinarDeleteForbiddenException();

    const participantsIds =
      await this.participationRepository.findParticipantsIds(command.webinarId);

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
      command.webinarId,
    );
    await this.webinarRepository.cancel(command.webinarId);
  }
}
