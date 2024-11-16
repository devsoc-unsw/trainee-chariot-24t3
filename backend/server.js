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

  if (!event.title || !event.date) {
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

// POST route to create a new event
app.post('/api/events', async (req, res) => {
  try {
    const { name, date, time, location } = req.body;

    // Validate inputs
    if (!name || !date || !time || !location || !location.lat || !location.lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newEvent = new Event({
      name,
      date,
      time,
      location: {
        lat: location.lat,
        lng: location.lng,
        building: location.building,
        room: location.room
      }
    });

    await newEvent.save();
    res.status(200).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'An error occurred while creating the event' });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// start the Express server
app.listen(PORT, () => {
  connectDb();
  console.log(`Server listening on port ${PORT}`);
});
