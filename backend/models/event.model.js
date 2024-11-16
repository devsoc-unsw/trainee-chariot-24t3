import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      building: { type: String },
      room: { type: String }
    }
  },
  { timestamps: true } // mongoose will store createdAt and updatedAt everytime
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
