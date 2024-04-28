export abstract class UserRepository {
  abstract authenticate(token: string): Promise<boolean>;
}
