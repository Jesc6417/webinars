import { Entity } from './../../core';

type PropsParticipation = {
  userId: string;
  webinarId: string;
};

export class Participation extends Entity<PropsParticipation> {}
