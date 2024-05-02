import { Email } from './../models/email';
import { Mailer } from './../ports/mailer';

export class MailerFacade extends Mailer {
  public readonly sentEmails: Email[] = [];

  async sendEmail(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}
