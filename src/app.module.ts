import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
import { IcsService } from './ics/ics.service';
import { MailerController } from './mailer/mailer.controller';
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    CalendarController,
    GoogleController,
    MailerController,
  ],
  providers: [
    AppService,
    CalendarService,
    GoogleService,
    MailerService,
    IcsService,
  ],
})
export class AppModule {}
