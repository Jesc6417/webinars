import { Organizer } from './../entities';
import { Entity } from './../../core';
import { differenceInDays } from 'date-fns';

type WebinarProps = {
  id: string;
  title: string;
  seats: number;
  start: Date;
  end: Date;
  organizerId: string;
};

export class Webinar extends Entity<WebinarProps> {
  isTooSoon(now: Date) {
    const diff = differenceInDays(this.props.start, now);

    return diff < 3;
  }

  hasTooManySeats() {
    return this.props.seats > 1000;
  }

  hasNoSeats() {
    return this.props.seats < 1;
  }

  isOrganizer(organizerId: string) {
    return this.props.organizerId === organizerId;
  }

  hasLessSeats(seats: number) {
    return this.props.seats > seats;
  }

  endsBeforeStart() {
    return this.props.end < this.props.start;
  }

  hasNotEnoughSeats(participants: number) {
    return this.props.seats === participants;
  }
}
