import { User } from './../../users';

export namespace UserSeeds {
  export const token = 'YWxpY2VAZ21haWwuY29tOmF6ZXJ0eQ==';
  export const alice = new User({
    email: 'alice@gmail.com',
    token,
    id: 'id-alice',
  });
}
