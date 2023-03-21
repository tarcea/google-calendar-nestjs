import { authenticate } from '@google-cloud/local-auth';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google } from 'googleapis';
import path from 'path';

@Injectable()
export class CalendarService {
  constructor(private config: ConfigService) {}
  getCalendar() {
    return 'Here is your calendar, dude...';
  }

  SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

  // refresh_token comming from client???
  refresh_token = '';

  googleCredentials = {
    client_id: this.config.get('GOOGLE_CLIENT_ID'),
    project_id: this.config.get('GOOGLE_PROJECT_ID'),
    auth_uri: this.config.get('GOOGLE_AUTH_URI'),
    token_uri: this.config.get('GOOGLE_TOKEN_URI'),
    auth_provider_x509_cert_url: this.config.get(
      'GOOGLE_PROVIDER_X509_CERT_URL',
    ),
    client_secret: this.config.get('GOOGLE_CLIENT_SECRET'),
  };

  async loadSavedCredentialsIfExist() {
    try {
      return google.auth.fromJSON({
        ...this.googleCredentials,
        refresh_token: this.refresh_token,
      });
    } catch (err) {
      return null;
    }
  }

  async getCredentials(client) {
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: this.googleCredentials.client_id,
      client_secret: this.googleCredentials.client_secret,
      refresh_token: client.credentials.refresh_token || this.refresh_token,
    });
    this.refresh_token = client.credentials.refresh_token;
    return payload;
  }

  async authorize() {
    let client: OAuth2Client | JSONClient =
      await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.getCredentials(client);
    }
    console.log('ccc', client);
    return client;
  }

  async getEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }
    console.log('Upcoming 10 events:');
    return events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      return `${start} - ${event.summary}`;
    });
  }

  async insertEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });

    // simulate date for event
    const eventStartTime = new Date();
    eventStartTime.setDate(eventStartTime.getDate() + 2);

    const eventEndTime = new Date();
    eventEndTime.setDate(eventStartTime.getDate() + 2);
    eventEndTime.setMinutes(eventStartTime.getMinutes() + 45);

    calendar.events.insert(
      {
        auth: auth,
        calendarId: 'primary',
        requestBody: {
          summary: 'Your booking',
          location: 'Slottsbacken 11130 Slottsbacken 8',
          start: {
            dateTime: eventStartTime.toISOString(),
            timeZone: 'Europe/Stockholm',
          },
          end: {
            dateTime: eventEndTime.toISOString(),
            timeZone: 'Europe/Stockholm',
          },
        },
      },
      (err, event) => {
        if (err) {
          console.log(
            'There was an error contacting the Calendar service: ' + err,
          );
          return;
        }
        console.log('Event created: %s', event.htmlLink);
      },
    );
  }
}
