import { DomainException } from './../../core/exceptions';

export class WebinarDeleteForbiddenException extends DomainException {
  constructor() {
    super('You are not allowed to delete this webinar.');
  }
}
