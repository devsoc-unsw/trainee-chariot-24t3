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

app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
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
