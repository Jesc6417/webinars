import { UserRepository } from '../ports';
import { User } from './../entities';

export class InMemoryUserRepository extends UserRepository {
  readonly database: User[] = [];

  async authenticate(data: { email: string; password: string }) {
    const token = Buffer.from(`${data.email}:${data.password}`).toString(
      'base64',
    );

    const result = this.database.find((user) => user.props.token === token);

    return result?.props.token;
  }

  async validate(token: string) {
    return this.database.find((user) => user.props.token === token);
  }
}
