import { DomainException } from './../../../core/exceptions';

export class WebinarCannotReduceNumberOfSeatsException extends DomainException {
  constructor() {
    super('You cannot reduce number of seats.');
  }
}
