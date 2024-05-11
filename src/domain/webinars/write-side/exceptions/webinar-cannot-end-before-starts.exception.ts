import { DomainException } from './../../../core/exceptions';

export class WebinarCannotEndBeforeStartsException extends DomainException {
  constructor() {
    super('Webinar cannot end before it starts.');
  }
}
