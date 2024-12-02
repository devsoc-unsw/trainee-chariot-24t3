import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";

// Models
import Event from "./models/event.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// CORS middleware to parse JSON
app.use(cors());
app.use(express.json());

////////////////////////////////////////////////////////////////////////////////////////////////////
// WRITE BELOW ONLY!!

app.post("/event/create", async (req, res) => {
  const event = req.body;

  if (!event.name || !event.date || !event.time || !event.location) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all values" });
  }

  const newEvent = new Event(event);
  try {
    await newEvent.save();
    return res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    console.error("Error in creating event", err.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/event/eventList", async (req, res) => {
  const state = req.query.state; 

  //Based on the state, return the event List dependent on the state of the list 

  if (state !== "UPCOMING" && state !== "ONGOING" && state !== "NEWEST") {
    return res 
      .status(401)
      .json({success: false, message: "Invalid state of event list"}); 
  }


  try {
    //Finds the event based on state of the applicaiton 
    const eventList = await eventListFind(state); 

    return res.status(201).json({success: true, data: eventList}); 
  } catch (err) {
    return res 
      .status(400)
      .json({success: false, message: "Unable to retrieve event list"}); 
  }

})

async function eventListFind(state) {
  let eventList = []; 

  const currentDate = new Date(); 
  console.log(currentDate);
  console.log(currentDate.setHours(0, 0, 0, 0));
  console.log(currentDate.setHours(23, 59, 59, 999));
  try {
    if (state === "UPCOMING") {
      //Sorts the event List by dates of events that are greater than the current date
      //Sorted in ascending order 
      ; 
      eventList = await Event.find({ date: { $gte: currentDate }}).sort({ date: 1});
    } else if (state === "ONGOING") {
      //Comment: Will we have a start time and end time ??? 
      //Currently it will return the events hapening today 
      eventList = await Event.find({   
        date: { 
          $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
          $lte: new Date(currentDate.setHours(23, 59, 59, 999))
        }
      }).sort({date: 1}); 

    } else if (state === "NEWEST") {
      //Sorts the event List by created time and in descending order 
      eventList = await Event.find().sort({createdAt: 1}); 
    }

    // if (!eventList || eventList.length === 0) {
    //   eventList = []
    //   throw new Error('No events going on right now')
    // }

    return eventList; 
  } catch (error) {
    throw new Error('Unable to get the event List');
  }
}

app.get("/event/:id", async (req, res) => {
  const eventId = req.params.id; 
  
  if (!eventId) {
    //No eventId given
    return res 
      .status(400)
      .json({success: false, message: "Please provide valid event Id"}); 
  }

  try {
    const eventData = await Event.findById(eventId); 
    return res.status(201).json({ success: true, data: eventData}); 
  } catch(err) {
    console.error("Error in getting the event data for event Id", eventId); 
    return res.status (500).json({success: false, message: "Cannot get event data"})
  }

})


app.delete("/event/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Server not found" });
    }
    return res.status(201).json({ success: true, message: "Event successfully deleted" });
  } catch (err) {
    console.error("Error deleting event", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});  

////////////////////////////////////////////////////////////////////////////////////////////////////

// start the Express server
app.listen(PORT, () => {
  connectDb();
  console.log(`Server listening on port ${PORT}`);
});
