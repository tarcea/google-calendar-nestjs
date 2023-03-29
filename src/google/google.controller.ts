import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}
  @Get()
  getCalendar() {
    return this.googleService.getGoogleCalendar();
  }

  @Get('redirect')
  async redirect(@Query() query) {
    console.log(query);
    return await this.googleService.getToken('aaa');
  }
}
