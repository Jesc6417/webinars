import { UserRepository } from '../ports';

export class InMemoryUserRepository extends UserRepository {
  readonly database: string[] = [];

  async authenticate(token: string) {
    return this.database.indexOf(token) !== -1;
  }
}
