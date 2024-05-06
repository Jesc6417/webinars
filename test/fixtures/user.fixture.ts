import { User, UserRepository } from '@/domain/users';
import { AppTest } from '../app-test';
import { Fixture } from './fixture';

export class UserFixture extends Fixture {
  constructor(public entity: User) {
    super();
  }

  async load(app: AppTest): Promise<void> {
    const userRepository: UserRepository = app.get(UserRepository);

    await userRepository.create(this.entity);
  }

  createAuthorizationToken(): string {
    return `Basic ${this.entity.props.token}`;
  }

  getToken(): string {
    return this.entity.props.token;
  }
}
