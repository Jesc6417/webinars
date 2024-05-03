import { DomainException } from './../../core/exceptions';

export class WebinarNoMoreSeatsAvailableException extends DomainException {
  constructor() {
    super('No more seats available.');
  }
}
