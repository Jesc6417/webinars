import { WebinarNotFoundException } from './../exceptions';
import {
  OrganizerRepository,
  ParticipationRepository,
  WebinarQueryStore,
  WebinarRepository,
} from './../ports';

export class WebinarByIdQueryStore {
  constructor(
    private webinarQueryStore: WebinarQueryStore,
    private webinarRepository: WebinarRepository,
    private organizerRepository: OrganizerRepository,
    private participationRepository: ParticipationRepository,
  ) {}

  async store(webinarId: string) {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    const email = await this.organizerRepository.findEmail(
      webinar.props.organizerId,
    );
    const participations =
      await this.participationRepository.countParticipations(webinar.props.id);

    await this.webinarQueryStore.storeWebinarById(webinar.props.id, {
      id: webinar.props.id,
      title: webinar.props.title,
      start: webinar.props.start,
      end: webinar.props.end,
      organizer: {
        id: webinar.props.organizerId,
        email: email!,
      },
      seats: {
        reserved: participations,
        available: webinar.props.seats - participations,
      },
    });
  }
}
