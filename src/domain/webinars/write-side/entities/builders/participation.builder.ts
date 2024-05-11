import { StubOrganizerBuilder } from './organizer.builder';
import { StubWebinarBuilder } from './webinar.builder';
import { Participation } from './../participation';

export class ParticipationBuilder {
  protected webinarId: string;
  protected participantId: string;

  withWebinarId(webinarId: string) {
    this.webinarId = webinarId;
    return this;
  }

  withParticipantId(participantId: string) {
    this.participantId = participantId;
    return this;
  }

  build() {
    return new Participation({
      webinarId: this.webinarId,
      participantId: this.participantId,
    });
  }
}

export class StubParticipationBuilder extends ParticipationBuilder {
  override webinarId = new StubWebinarBuilder().build().props.id;
  override participantId = new StubOrganizerBuilder().build().props.id;
}
