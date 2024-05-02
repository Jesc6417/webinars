import { MailerFacade } from '@/domain/core/mailer/adapters/mailer.facade';
import { Mailer } from '@/domain/core/mailer/ports/mailer';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: Mailer,
      useClass: MailerFacade,
    },
  ],
  exports: [Mailer],
})
export class ToolsModule {}
