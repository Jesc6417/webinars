import { DomainException } from './../../core/exceptions';

export class WebinarTooManySeatsException extends DomainException {
  constructor() {
    super('Webinar must have a maximum of 1000 seats.');
  }
}
