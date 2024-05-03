import { DomainException } from './../../core/exceptions';

export class ParticipationNotFoundException extends DomainException {
  constructor() {
    super('Participation not found.');
  }
}
