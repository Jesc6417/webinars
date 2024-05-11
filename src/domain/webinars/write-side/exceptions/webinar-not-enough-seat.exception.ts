import { DomainException } from './../../../core/exceptions';

export class WebinarNotEnoughSeatException extends DomainException {
  constructor() {
    super('Webinar must have at least 1 seat.');
  }
}
