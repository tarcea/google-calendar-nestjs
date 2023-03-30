import { Controller, Get, Query } from '@nestjs/common';
import { EmailDto } from './email.dto';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}
  @Get()
  async sendEmail(@Query() emailDto: EmailDto) {
    const { email } = emailDto;

    await this.mailerService.sendNewEmail(email);
    return { message: `an email was sent to '${email}'` };
  }
}
