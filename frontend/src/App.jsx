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
      <div className="flex bg-[#F97316] h-30% justify-between lg:text-2xl text-base pl-10 pr-10 items-center md:flex-nowrap md:flex-row flex-col">
        <div className="flex gap-4 items-center cursor-pointer lg:text-4xl sm:text-4xl md:text-4xl text-white flex-nowrap md:flex-row flex-col lg:p-0 ">
          <img src={LostOnCampusLogo} alt="LostOnCampus Logo" className="lg-md:lg-28 md:h-16 lg:w-32 lg:h-20">
          </img>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl flex-nowrap">
            Bored On Campus 
          </p>
        </div>
        <div className="flex gap-4 cursor-pointer ">
          <a
            onClick={() => navigate("/eventList")}
            className="flex p-2 items-center gap-2 hover:underline bg-[#ea580c] rounded-lg text-white"
          >
            {" "}
            <CalendarMonthIcon sx={{ fontSize: 30 }} /> Event List
          </a>
          <a
            onClick={() => navigate("/")}
            className="p-2 flex items-center gap-2 hover:underline bg-[#ea580c] rounded-lg text-white"
          >
            <MapIcon sx={{ fontSize: 30 }} /> View Events Today
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
