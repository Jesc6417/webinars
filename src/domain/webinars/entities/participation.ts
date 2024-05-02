import { Entity } from './../../core';

type PropsParticipation = {
  participantId: string;
  webinarId: string;
};

export class Participation extends Entity<PropsParticipation> {}
