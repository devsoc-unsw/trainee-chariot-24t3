import { Routes, Route, useNavigate } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MapPage from "./screens/MapPage";
import EventList from "./screens/EventList";
import EventPage from "./screens/EventPage";
import Dummy from "./screens/Dummy";
import LostOnCampusLogo from "./assets/locLogo.png";
import * as crypto from "node:crypto";
import "./App.css";

function App() {
  if (!localStorage.token) {
    //User has visited site for the first time 
    localStorage.token = makeid(20)
  } 

  const navigate = useNavigate();
  return (
    <>
      <div className="flex bg-[#FFA438] h-20 justify-between text-4xl pl-10 pr-10 items-center">
        <div className="flex gap-4 items-center cursor-pointer ">
          <img src={LostOnCampusLogo} alt="LostOnCampus Logo"></img>
          <p>
            Bored<a className="text-yellow-300	">On</a>Campus
          </p>
        </div>
        <div className="flex gap-2 cursor-pointer ">
          <a
            onClick={() => navigate("/eventList")}
            className="flex p-2 items-center gap-2 hover:underline"
          >
            {" "}
            <CalendarMonthIcon sx={{ fontSize: 48 }} /> Events
          </a>
          <a
            onClick={() => navigate("/")}
            className="p-2 flex items-center gap-2 hover:underline"
          >
            <MapIcon sx={{ fontSize: 48 }} /> View Events On Map
          </a>
          {/* <a onClick={() => navigate("/dummy")}>Dummy</a> */}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/eventList" element={<EventList />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/dummy" element={<Dummy />} />
      </Routes>
    </>
  );
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


export default App;
