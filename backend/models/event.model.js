import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    picture: {
      type: String, 
      required: false, 
    }, 
    location: {
      type: String, 
      required: true, 
    }, 
    body: {
      type: String, 
      required: true, 
    }, 
  },
  { timestamps: true } // mongoose will store createdAt and updatedAt everytime
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
