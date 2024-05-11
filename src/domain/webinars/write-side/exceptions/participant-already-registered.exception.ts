import { DomainException } from './../../../core/exceptions';

export class ParticipantAlreadyRegisteredException extends DomainException {
  constructor() {
    super('Participant already registered.');
  }
}
