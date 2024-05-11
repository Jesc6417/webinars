import { DomainException } from './../../../core/exceptions';

export class ParticipantNotFoundException extends DomainException {
  constructor() {
    super('Participant not found.');
  }
}
