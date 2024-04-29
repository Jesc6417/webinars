import { z } from 'zod';

export namespace WebinarAPI {
  export namespace OrganizeWebinar {
    export const schema = z.object({
      start: z.coerce.date(),
      end: z.coerce.date(),
      title: z.string(),
      seats: z.number(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = { id: string };
  }
}
