import { StubWebinarBuilder } from './webinar.builder';
import { Organizer } from './../organizer';

export class OrganizerBuilder {
  protected id: string;
  protected email: string;

  withId(id: string) {
    this.id = id;
    return this;
  }

  withEmail(email: string) {
    this.email = email;
    return this;
  }

  build() {
    return new Organizer({
      id: this.id,
      email: this.email,
    });
  }
}

export class StubOrganizerBuilder extends OrganizerBuilder {
  override id = new StubWebinarBuilder().build().props.organizerId;
  override email = 'juliette@gmail.com';
}
