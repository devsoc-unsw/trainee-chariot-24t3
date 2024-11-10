import axios from "axios";
import { useState } from "react";

const PORT = 5050;

function Dummy() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:${PORT}/event/create`, {
        title: title,
        date: date,
      });
      console.log("Event created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="justify-center flex items-center h-screen">
      <form
        className=" flex flex-col w-96 gap-2 p-10 bg-[#F2E3BC]"
        onSubmit={createEvent}
      >
        <div>
          <label>Title: </label>{" "}
          <input
            className="p-1"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Date: </label>{" "}
          <input
            className="p-1"
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>
        <button>Submit!</button>
      </form>
    </div>
  );
}

export default Dummy;
