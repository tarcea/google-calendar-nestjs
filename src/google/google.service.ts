import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import path from 'path';

@Injectable()
export class GoogleService {
  constructor(private config: ConfigService) {}
  getGoogleCalendar() {
    return 'Here is your calendar, dude...';
  }

  SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

  // refresh_token comming from client or db???
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

  makeOAuth2Client() {
    return new google.auth.OAuth2(
      this.googleCredentials.client_id,
      this.googleCredentials.client_secret,
      '/redirect',
    );
  }

  async getRefreshToken(client, code) {
    const token = await client.getToken(code);
    return token;
  }

  async getAuthUrl(client) {
    client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
  }

  async getToken(code) {
    const oauth2Client = this.makeOAuth2Client();

    if (this.refresh_token === '') {
      this.refresh_token = await this.getRefreshToken(oauth2Client, code);
    } else {
      this.getAuthUrl(oauth2Client);
    }
  }
}
