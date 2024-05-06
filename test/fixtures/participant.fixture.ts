import { User, UserRepository } from '@/domain/users';
import { AppTest } from '../app-test';
import { Fixture } from './fixture';

export class ParticipantFixture extends Fixture {
  constructor(public entity: User) {
    super();
  }

  async load(app: AppTest): Promise<void> {
    const userRepository: UserRepository = app.get(UserRepository);

    await userRepository.create(this.entity);
  }
}
