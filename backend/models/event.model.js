import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: false },
    time: { type: String, required: false },
    location: {
      coords: {type: Number, type: Number}, 
      building: { type: String },
      room: { type: String }
    }, 
    token: { type: String, required: true }
  },
  { timestamps: true } // mongoose will store createdAt and updatedAt everytime
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
