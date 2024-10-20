import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MapPage from "./screens/MapPage";
import EventList from "./screens/EventList";
import "./App.css";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-evenly w-full">
        <a onClick={() => navigate("/")}>Events</a>
        <a onClick={() => navigate("/map")}>Map</a>
      </div>

      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </>
  );
}

export default App;
