import { User } from './../entities';

export abstract class UserRepository {
  abstract authenticate(token: string): Promise<boolean>;

  abstract validate(token: string): Promise<User | undefined>;

  abstract create(user: User): Promise<void>;
}
