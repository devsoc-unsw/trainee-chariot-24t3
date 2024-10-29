import { Routes, Route, useNavigate } from "react-router-dom";
import MapPage from "./screens/MapPage";
import EventList from "./screens/EventList";
import EventPage from "./screens/EventPage";
import "./App.css";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-evenly w-full cursor-pointer bg-[#D9D9D9]">
        <a onClick={() => navigate("/")}>Map</a>
        <a onClick={() => navigate("/eventList")}>EventList</a>
        <a onClick={() => navigate("/eventPage")}>EventPage</a>
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
