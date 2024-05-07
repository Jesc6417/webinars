import { z } from 'zod';

export namespace UserApi {
  export namespace AuthenticateUser {
    export const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = { access_token: string };
  }

  export namespace RegisterUser {
    export const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = { id: string };
  }
}
