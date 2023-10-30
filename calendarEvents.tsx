import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const calendar = google.calendar("v3");


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;  //credentials you can get from google console
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ;



// problem {
// 	_id: Types.ObjectId;
// 	setName: string;
// 	userId: Types.ObjectId;
// 	startTime: Date;
// 	endTime: Date;
// 	calendarEventId:string;
// }


// user model based on the below schema

// user {
// 	email: string;
// 	name: string;
// 	profileImage: string;
// 	access_token: string;
// 	refresh_token: string;
// }



// export class IError extends Error {
// 	code: number;
// 	text: string;
// 	constructor(text: string, code: number) {
// 		super();
// 		this.text = text;
// 		this.code = code;
// 	}
// }


// scopes required are:

// 'https://www.googleapis.com/auth/userinfo.profile',
// 'https://www.googleapis.com/auth/userinfo.email',
// 'https://www.googleapis.com/auth/calendar.readonly', (not necessary)
// 'https://www.googleapis.com/auth/calendar',  (not necessary)
// 'https://www.googleapis.com/auth/calendar.events.readonly',
// 'https://www.googleapis.com/auth/calendar.events'




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

    const eventId = result.data.id;

    return eventId;
    
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

    //the refresh token is generated during authorization of user 
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






