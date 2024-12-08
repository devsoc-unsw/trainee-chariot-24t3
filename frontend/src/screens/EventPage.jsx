import arcLogo from "../assets/arcLogo.jpg";
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function EventPage() {
  const [event, setEvent] = useState([]); 

  const { id } = useParams(); 
  window.scrollTo(0, 0);

  useEffect(() => {
    fetchInfo(id)
  },[])

  const fetchInfo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5050/event/${id}`);
      
      if (!response.ok) {
        console.log(response.json().message)
        throw new Error(`Could not fetch the events`);
      }

      const responseData = await response.json(); 

      setEvent(responseData.data); 
      console.log(responseData.data); 
    } catch (error) {
      console.log(error.message)
    }
  }

  console.log(id); 

  return (
    <div>
      <div className="w-full h-screen bg-[#FCFDAF]">
        <div className="font-bold text-3xl p-8">
          {event.name}
        </div>
        <div className="flex justify-center">
          <img
            src={arcLogo}
            alt="Arc Logo"
            className="h-auto rounded-lg shadow-lg z-10"
          ></img>
        </div>

        <div className="relative bottom-48 w-full h-48 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[#E1BA57] rounded-t-full"></div>
        </div>

        <div className="relative bottom-48 w-full h-[30%] bg-[#E1BA57]">
          <div className="flex items-center h-60">
            <div className="flex-1 p-4">
              <h2 className="text-3xl font-semibold text-white p-6">Where</h2>
              <p className="text-xl text-white">Law Building 163</p>
            </div>
            <div className="flex-1 p-4">
              <h2 className="text-3xl font-semibold text-white p-6">When</h2>
              <p className="text-xl text-white">4-6pm, Fri, May 9 2025</p>
            </div>
          </div>
        </div>

        <div className="relative bottom-48 w-full h-48 overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[#E1BA57] rounded-b-full"></div>
        </div>
      </div>

      <div className="h-screen flex flex-col items-center justify-center w-full bg-[#FCFDAF] z-25">
        <div className="font-bold text-3xl pt-[22%] z-10">Description</div>
        <div className="text-3xl p-8 w-[50%] z-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      </div>
    </div>
  );
}

export default EventPage;
