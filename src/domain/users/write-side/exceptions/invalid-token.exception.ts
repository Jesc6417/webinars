import { DomainException } from './../../../core/exceptions';

export class InvalidTokenException extends DomainException {
  constructor() {
    super('Invalid token.');
  }
}
