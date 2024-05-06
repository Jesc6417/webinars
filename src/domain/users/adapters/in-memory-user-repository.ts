import { UserRepository } from '../ports';
import { User } from './../entities';

export class InMemoryUserRepository extends UserRepository {
  readonly database: User[] = [];

  async authenticate(token: string) {
    const result = this.database.find((user) => user.props.token === token);

    return !!result;
  }

  async validate(token: string) {
    return this.database.find((user) => user.props.token === token);
  }

  async create(user: User) {
    this.database.push(user);
  }
}
