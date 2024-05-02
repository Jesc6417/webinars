import { Entity } from './../../core';

type ParticipantProps = {
  id: string;
  email: string;
};

export class Participant extends Entity<ParticipantProps> {}
