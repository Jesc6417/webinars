import { DomainException } from './../../../core/exceptions';

export class WebinarUpdateForbiddenException extends DomainException {
  constructor() {
    super('You are not allowed to modify this webinar.');
  }
}
