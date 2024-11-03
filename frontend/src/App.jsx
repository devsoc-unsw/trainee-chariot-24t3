import { Routes, Route, useNavigate } from "react-router-dom";
import MapIcon from '@mui/icons-material/Map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapPage from "./screens/MapPage";
import EventList from "./screens/EventList";
import EventPage from "./screens/EventPage";
// import LostOnCampusLogo from "./assets/locLogo.png";
import "./App.css";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex cursor-pointer bg-[#FFA438] h-20 justify-between text-4xl pl-10 pr-10 items-center">
        <div className="flex gap-4 items-center"> 
          {/* <img src={LostOnCampusLogo} alt="LostOnCampus Logo"> */}
          {/* </img> */}
          <p>
            Bored<a className="text-yellow-300	">On</a>Campus
          </p>
        </div>
        <div className="flex gap-2"> 
          <a onClick={() => navigate("/")} className="p-2 flex items-center gap-2"><MapIcon sx={{ fontSize: 48 }}  /> View Events On Map</a>
        </div>
        
      </div>

      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/eventList" element={<EventList />} />
        <Route path="/eventPage" element={<EventPage />} />
      </Routes>
    </>
  );
}

export default App;
