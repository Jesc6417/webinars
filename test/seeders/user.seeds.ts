import { User } from '@/domain/users';
import { UserFixture } from '../fixtures/user.fixture';

export const e2eUsers = {
  johnDoe: new UserFixture(
    new User({
      email: 'john-doe@gmail.com',
      token: 'am9obi1kb2VAZ21haWwuY29tOmF6ZXJ0eQ==',
      id: 'john-doe',
    }),
  ),
};
