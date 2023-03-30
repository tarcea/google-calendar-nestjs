import { Injectable } from '@nestjs/common';
import { getDate, getMinutes, getMonth, getYear, parseISO } from 'date-fns';
import { createEvent, DateArray, EventAttributes } from 'ics';
import { BookingContent } from './booking-content.model';

@Injectable()
export class IcsService {
  getTimesArray(data: string): DateArray {
    const time = parseISO(data);
    return [
      getYear(time),
      getMonth(time) + 1,
      getDate(time),
      new Date(time).getUTCHours(),
      getMinutes(time),
    ];
  }

  parseContentToEvent(content: BookingContent): EventAttributes {
    const { startTime, endTime, location, title } = content;
    return {
      start: this.getTimesArray(startTime),
      end: this.getTimesArray(endTime),
      title: title,
      description: `Your booking`,
      location: `${location.address}, ${location.postalCode}, ${location.city}`,
    };
  }

  createIcsResponse(content: BookingContent): icsResponse {
    const event: EventAttributes = this.parseContentToEvent(content);
    const { value, error } = createEvent(event);
    const result: icsResponse = { ics: value, error };
    if (error) {
      result.error = error;
    }

    return result;
  }

  createIcs(content: BookingContent): string {
    const { ics, error } = this.createIcsResponse(content);

    if (error) {
      console.error(error['errors']);
      return;
    }

    return ics;
  }
}
