import { UserRepository } from '../ports/user.repository';

export class InMemoryUserRepository extends UserRepository {
  readonly database: string[] = [];

  async authenticate(token: string) {
    return this.database.indexOf(token) !== -1;
  }
}
