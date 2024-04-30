import { Entity } from './../../core';

type UserProps = {
  id: string;
};

export class User extends Entity<UserProps> {}
