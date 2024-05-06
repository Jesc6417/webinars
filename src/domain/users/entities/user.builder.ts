import { User } from './user';

export class UserBuilder {
  protected id: string;
  protected email: string;
  protected token: string;

  withId(id: string) {
    this.id = id;
    return this;
  }

  withEmail(email: string) {
    this.email = email;
    return this;
  }

  withToken(token: string) {
    this.token = token;
    return this;
  }

  build(): User {
    return new User({
      id: this.id,
      email: this.email,
      token: this.token,
    });
  }
}

export class StubUserBuilder extends UserBuilder {
  override email = 'alice@gmail.com';
  override token = 'YWxpY2VAZ21haWwuY29tOmF6ZXJ0eQ==';
  override id = 'id-alice';
}
