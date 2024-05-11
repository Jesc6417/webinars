import { Entity } from './../../../core';

type OrganizerProps = {
  id: string;
  email: string;
};

export class Organizer extends Entity<OrganizerProps> {}
