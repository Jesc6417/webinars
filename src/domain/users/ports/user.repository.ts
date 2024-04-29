import { User } from './../entities/user';

export abstract class UserRepository {
  abstract authenticate(data: {
    email: string;
    password: string;
  }): Promise<string | undefined>;

  abstract validate(token: string): Promise<User | undefined>;
}
