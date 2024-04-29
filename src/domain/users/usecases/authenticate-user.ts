import { UserRepository } from './../ports';

export class AuthenticateUser {
  constructor(private readonly authenticator: UserRepository) {}

  async execute(payload: { email: string; password: string }) {
    const token = Buffer.from(`${payload.email}:${payload.password}`).toString(
      'base64',
    );

    const authenticated = await this.authenticator.authenticate(token);

    if (!authenticated) throw new Error('User not found.');

    return { authenticated };
  }
}
