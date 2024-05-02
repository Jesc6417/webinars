import { DomainException } from './../../core/exceptions';

export class WebinarTooEarlyException extends DomainException {
  constructor() {
    super('Webinar must happen in at least 3 days.');
  }
}
