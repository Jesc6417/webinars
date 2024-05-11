import { Webinar } from './../webinar';

export class WebinarBuilder {
  protected id: string;
  protected title: string;
  protected seats: number;
  protected start: Date;
  protected end: Date;
  protected organizerId: string;

  withId(id: string) {
    this.id = id;
    return this;
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withStart(start: Date) {
    this.start = start;
    return this;
  }

  withEnd(end: Date) {
    this.end = end;
    return this;
  }

  withOrganizerId(organizerId: string) {
    this.organizerId = organizerId;
    return this;
  }

  withSeats(seats: number) {
    this.seats = seats;
    return this;
  }

  build(): Webinar {
    return new Webinar({
      id: this.id,
      title: this.title,
      start: this.start,
      end: this.end,
      seats: this.seats,
      organizerId: this.organizerId,
    });
  }
}

export class StubWebinarBuilder extends WebinarBuilder {
  override id = 'id-webinar-1';
  override title = 'Node.js webinar';
  override start = new Date('2024-05-16T14:00:00.000Z');
  override end = new Date('2024-05-16T17:00:00.000Z');
  override seats = 100;
  override organizerId = 'id-organizer-1';
}
