import { Email } from './../models/email';

export abstract class Mailer {
  abstract sendEmail(email: Email): Promise<void>;
}
