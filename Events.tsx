import userModel from "../models/user";
import { IError } from "../types/IError";
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const calendar = google.calendar("v3");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ;

export const addEventInCalendar = async (problem:any) => {
  try {

    const user = await userModel.findById(problem.userId);

    if (!user) {
      throw new IError("User not found", 404);
    }

    const event = {
      start: {
        dateTime: problem.startTime,
      },
      end: {
        dateTime: problem.endTime,
      },
      attendees: [
        {
          email:"" //email ids of people whom to send ,
        },
      ],
      summary:problem.setName,

    };

    const auth = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
    auth.setCredentials({
      refresh_token: user.refresh_token,
    });

    const result = await calendar.events.insert({
      auth,
      calendarId: user.email,
      requestBody: event,
    });

    const data = result.data;

    return data.id;
  } catch (error) {
    console.log(error);
  }
};

export const RemoveEventfromCalendar = async (problem:any) => {
  try {
    const user = await userModel.findById(problem.userId);
    const auth = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

    auth.setCredentials({
      refresh_token: user?.refresh_token,
    });

    const result = await calendar.events.delete({
      auth,
      calendarId: user?.email,
      eventId: problem.calendarEventId,
    });

    console.log(`Event has been deleted from the calendar.`);
    console.log(result)

    return "Event deleted"
  } catch (error) {
    console.log(error);
  }
};

export const RescheduleEventInCalendar = async (problem:any) => {
  try {

    const user = await userModel.findById(problem.facultyId);

    const auth = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

    auth.setCredentials({
      refresh_token: user?.refresh_token,
    });

    const eventPatch = {
      start: {
        dateTime: problem.startTime,
      },
      end: {
        dateTime: problem.endTime,
      },
    };

    const result = await calendar.events.patch({
      auth,
      calendarId:user?.email,
      eventId: problem.calendarEventId,
      requestBody: eventPatch,
    });

    console.log(result);

    return "event updated"
  } catch (error) {
    console.log(error);
  }
};






