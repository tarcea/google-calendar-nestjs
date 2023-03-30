# Description

## Conection with Google Calendar API through NestJS

Follow the steps described here,
[Node.js quickstart](https://developers.google.com/calendar/api/quickstart/nodejs) for Google Calendar API, up to the point you download your credentials.

Include `credentials.json` in your working directory and add `.env` as in `env.example`, before running `yarn start:dev`

[http://localhost:3000/calendar/events](http://localhost:3000/calendar/events)

[http://localhost:3000/calendar/insert](http://localhost:3000/calendar/insert)

## Sending emails

Update the `.env` file with the details of an SMTP service (see `env.example`)

Send emails using the below endpoint (replace `avalidemail@something.com` with a valid email):

`http://localhost:3000/mailer?email=avalidemail@something.com`
