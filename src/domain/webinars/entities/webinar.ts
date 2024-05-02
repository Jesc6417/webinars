import { Organizer } from './../entities';
import { Entity } from './../../core';
import { differenceInDays } from 'date-fns';

type WebinarProps = {
  id: string;
  title: string;
  seats: number;
  start: Date;
  end: Date;
  organizer: Organizer;
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

  isCreator(organizerId: string) {
    return this.props.organizer.props.id === organizerId;
  }

  hasLessSeats(seats: number) {
    return this.props.seats > seats;
  }

  endsBeforeStart() {
    return this.props.end < this.props.start;
  }
}
