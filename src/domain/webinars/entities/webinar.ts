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
  initialState: WebinarProps;
  props: WebinarProps;

  constructor(data: WebinarProps) {
    this.initialState = { ...data };
    this.props = { ...data };

    Object.freeze(this.initialState);
  }

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

  update(data: Partial<WebinarProps>) {
    this.props = { ...this.props, ...data };
  }

  commit() {
    this.initialState = this.props;
  }

  isCreator(organizerId: string) {
    return this.props.organizerId === organizerId;
  }

  hasLessSeats(seats: number) {
    return this.props.seats > seats;
  }
}
