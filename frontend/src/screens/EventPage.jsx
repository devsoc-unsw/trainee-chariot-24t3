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
        <div className="font-bold text-3xl p-8">
          {event.name}
        </div>
        <div className="flex justify-center">
          <img
            src={getPicture(event.imageUrl)}
            alt="Arc Logo"
            className="h-auto rounded-lg shadow-lg z-10 w-[500px] h-[300px] "
          ></img>
        </div>

        <div className="relative bottom-48 w-full h-48 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[#E1BA57] rounded-t-full"></div>
        </div>

        <div className="relative bottom-48 w-full h-[30%] bg-[#E1BA57]">
          <div className="flex items-center h-60">
            <div className="flex-1 p-4">
              <h2 className="text-3xl font-semibold text-white p-6">Where</h2>
              
              <p className="text-xl text-white">{event.location.room.replace(/<[^>]*>/g, '') + " " +event.location.building.replace(/<[^>]*>/g, '')}</p>
            </div>
            <div className="flex-1 p-4">
              <h2 className="text-3xl font-semibold text-white p-6">When</h2>
              <p className="text-xl text-white">{new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) + "-" + new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} {day}</p>
            </div>
          </div>
        </div>

        <div className="relative bottom-48 w-full h-48 overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[#E1BA57] rounded-b-full"></div>
        </div>
      </div>

      <div className="h-screen flex flex-col items-center justify-center w-full bg-[#FCFDAF] z-25">
        <div className="font-bold text-3xl z-10">Description</div>
        <div className="text-3xl p-8 w-[50%] z-10 whitespace-pre-wrap">
          {event.desc || 'No description available'}
        </div>
      </div>
    </div>
  );
}

export default EventPage;
