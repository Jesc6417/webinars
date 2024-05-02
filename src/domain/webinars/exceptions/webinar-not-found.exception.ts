import { DomainException } from './../../core/exceptions';

export class WebinarNotFoundException extends DomainException {
  constructor() {
    super('Webinar not found.');
  }
}
