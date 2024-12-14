import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: false },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    location: {
      lat: {type: Number}, 
      lng: {type: Number}, 
      building: { type: String },
      room: { type: String }, 
      title: { type: String }
    }, 
    token: { type: String, required: true },
    desc: {type: String},
    imageUrl: {type: String}, 
  },
  { timestamps: true } // mongoose will store createdAt and updatedAt everytime
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
