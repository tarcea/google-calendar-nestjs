import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import { IcsService } from '../ics/ics.service';

@Injectable()
export class MailerService {
  constructor(private config: ConfigService, private icsService: IcsService) {}

  private readonly hostname = this.config.get('SMTP_HOST');
  private readonly username = this.config.get('SMTP_USERNAME');
  private readonly password = this.config.get('SMTP_PASSWORD');
  private readonly port = +this.config.get('SMTP_PORT');
  private readonly sender = this.config.get('SMTP_SENDER');

  private readonly transporter: Transporter = nodemailer.createTransport({
    host: this.hostname,
    port: this.port,
    secure: false,
    requireTLS: true,
    auth: {
      user: this.username,
      pass: this.password,
    },
    // logger: true,
  });

  ics = this.icsService.createIcs({
    title: 'Meeting with colleagues',
    startTime: '2023-04-29T14:07:00.000Z',
    endTime: '2023-04-30T16:30:00.000Z',
    location: {
      address: 'Slottsbacken 8',
      postalCode: '11130',
      city: 'Stockholm',
    },
  });

  async sendNewEmail(email: string) {
    try {
      await this.transporter.sendMail({
        from: this.sender,
        to: email,
        subject: 'You have a new booking',
        text: '',
        html: `
					<h3>
						Hi, your booking is confirmed!!
					</h3>
					<p>This is just a test to see how the attached calendar event looks like in different email clients.</p>
				`,
        // icalEvent: {
        //   // filename: 'invitation.ics',
        //   method: 'request',
        //   content: ics,
        // },
        attachments: [
          {
            filename: 'booking.ics',
            content: this.ics,
          },
        ],
      });
    } catch (err) {}
  }
}
