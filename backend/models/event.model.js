import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: false },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    location: {
      coords: {type: Number, type: Number}, 
      building: { type: String },
      room: { type: String }
    },
    desc: {type: String},
    imageUrl: {type: String}, 
  },
  { timestamps: true } // mongoose will store createdAt and updatedAt everytime
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
