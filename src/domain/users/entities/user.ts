type UserProps = {
  id: string;
  email: string;
  token: string;
};

export class User {
  constructor(public props: UserProps) {}
}
