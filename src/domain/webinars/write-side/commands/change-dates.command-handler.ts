import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import {
  WebinarCannotEndBeforeStartsException,
  WebinarNotFoundException,
  WebinarTooEarlyException,
  WebinarUpdateForbiddenException,
} from '../exceptions';
import { DateProvider, Mailer } from './../../../core';
import { Webinar } from './../entities';
import {
  ParticipantRepository,
  ParticipationRepository,
  WebinarRepository,
} from './../ports';

export class ChangeDatesCommand implements ICommand {
  constructor(
    public readonly webinarId: string,
    public readonly organizerId: string,
    public readonly start?: Date,
    public readonly end?: Date,
  ) {}
}

type Response = void;

@CommandHandler(ChangeDatesCommand)
export class ChangeDatesCommandHandler
  implements ICommandHandler<ChangeDatesCommand, Response>
{
  constructor(
    private readonly webinarRepository: WebinarRepository,
    private readonly participationRepository: ParticipationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly dateGenerator: DateProvider,
    private readonly mailer: Mailer,
  ) {}

  async execute(command: ChangeDatesCommand) {
    const webinar = await this.webinarRepository.findById(command.webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(command.organizerId))
      throw new WebinarUpdateForbiddenException();

    if (command.start) {
      webinar.update({ start: command.start });

      if (webinar.isTooSoon(this.dateGenerator.now()))
        throw new WebinarTooEarlyException();
    }

    if (command.end) webinar.update({ end: command.end });

    if (webinar.endsBeforeStart())
      throw new WebinarCannotEndBeforeStartsException();

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
    return this.participationRepository.findParticipantsIds(webinarId);
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
