import arcLogo from "../assets/arcLogo.jpg";
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function EventPage() {
  const [event, setEvent] = useState([]); 
  const [day, setDay] = useState([""]); 
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams(); 
  window.scrollTo(0, 0);

  useEffect(() => {
    fetchInfo(id)
  },[])

  const fetchInfo = async (id) => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:5050/event/${id}`);
      
      if (!response.ok) {
        console.log(response.json().message)
        throw new Error(`Could not fetch the events`);
      }

      const responseData = await response.json(); 
      const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const date = new Date(responseData.data.date); 
      const options = { 
        weekday: "long",
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      };
      
      const formattedDate = date.toLocaleDateString("en-US", options);
      setDay(formattedDate);

      setEvent(responseData.data); 
      console.log(responseData.data); 
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getPicture = (picture) => {
    return isValidUrl(picture) ? picture : arcLogo;
  };

  if (isLoading) {
    return <div> Loading... </div>
  }

  return (
    <div>
      <div className="w-full h-screen bg-[#FFF3E2]">
        <div className="font-bold text-4xl p-8">
          {event.name}
        </div>
        <div className="flex justify-center">
          <img
            src={getPicture(event.imageUrl)}
            alt="Arc Logo"
            className="rounded-lg shadow-lg z-10 w-auto h-[350px] "
          ></img>
        </div>

        <svg
          className="absolute top-[34.2%] left-0 w-full h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#c96e2e"
            d="M0,320C240,160,720,0,1440,320L1440,320L0,320Z"
          ></path>
        </svg>

        <div className="flex absolute left-0 top-[50%] w-full h-[60vh] bg-[#c96e2e] p-4 items-center">
          <div className="flex-1 p-4">
            <h2 className="text-4xl font-semibold text-white p-6">Where</h2>
            <p className="text-2xl text-white">{event.location.room.replace(/<[^>]*>/g, '')}</p>
            <p className="text-2xl text-white">{event.location.building.replace(/<[^>]*>/g, '')}</p>
          </div>
          <div className="flex-1 p-4">
            <h2 className="text-4xl font-semibold text-white p-6">When</h2>
            <p className="text-2xl text-white">{new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) + "-" + new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
            <p className="text-2xl text-white">{day}</p>
          </div>
        </div>

        <svg
          className="absolute top-[110%] left-0 w-full h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#c96e2e"
            d="M0,0C240,160,720,320,1440,0L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="flex flex-col items-center justify-center w-full bg-[#FFE6BA] z-25 p-20 min-h-screen">
        <div className="font-bold text-3xl z-10 p-8">Description</div>
        <div className="text-3xl w-[50%] z-10 whitespace-pre-wrap p-8">
          {event.desc || 'No description available'}
        </div>
      </div>
    </div>
  );
}

export default EventPage;
