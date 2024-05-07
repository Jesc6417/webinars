import { UserBuilder } from './../entities/user.builder';
import { v4 } from 'uuid';
import { Executable, IdProvider } from './../../core';
import { UserRepository } from './../ports';

type Request = { email: string; password: string };
type Response = { id: string };

export class RegisterUser implements Executable<Request, Response> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idProvider: IdProvider,
  ) {}

  async execute({ email, password }: Request) {
    const access_token = Buffer.from(`${email}:${password}`).toString('base64');
    const id = this.idProvider.generate();
    const user = new UserBuilder()
      .withId(id)
      .withEmail(email)
      .withToken(access_token)
      .build();

    await this.userRepository.create(user);

    return { id };
  }
}
