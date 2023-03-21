import { Controller, Get } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}
  @Get()
  getCalendar() {
    return this.calendarService.getCalendar();
  }

  @Get('events')
  async getEvents() {
    return await this.calendarService
      .authorize()
      .then(this.calendarService.getEvents)
      .catch(console.error);
  }

  @Get('insert')
  async insertEvent() {
    return await this.calendarService
      .authorize()
      .then(this.calendarService.insertEvent)
      .catch(console.error);
  }
}
