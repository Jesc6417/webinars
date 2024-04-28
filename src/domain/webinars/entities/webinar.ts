import { differenceInDays } from 'date-fns';

type WebinarProps = {
  id: string;
  title: string;
  seats: number;
  start: Date;
  end: Date;
  organizerId: string;
};

export class Webinar {
  constructor(public props: WebinarProps) {}

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
}
