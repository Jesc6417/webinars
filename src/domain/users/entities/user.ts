import { Entity } from './../../core';

type UserProps = {
  id: string;
  email: string;
  token: string;
};

export class User extends Entity<UserProps> {}
