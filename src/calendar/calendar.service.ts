import { authenticate } from '@google-cloud/local-auth';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google } from 'googleapis';
import path from 'path';

@Injectable()
export class CalendarService {
  getCalendar() {
    return 'Here is your calendar, dude...';
  }

  SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  TOKEN_PATH = path.join(process.cwd(), 'token.json');
  CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

  async loadSavedCredentialsIfExist() {
    try {
      const content = fs.readFileSync(this.TOKEN_PATH, 'utf8');
      const credentials = await JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client) {
    const content = fs.readFileSync(this.CREDENTIALS_PATH, 'utf8');

    const keys = await JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(this.TOKEN_PATH, payload);
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
      await this.saveCredentials(client);
    }
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
}
