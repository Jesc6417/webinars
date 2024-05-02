import { DomainException } from './../../core/exceptions';

export class UserNotFoundException extends DomainException {
  constructor() {
    super('User not found.');
  }
}
