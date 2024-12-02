import React, { useState, useEffect } from 'react';
import arcLogo from "../assets/arcLogo.jpg";
import climateExpo from "../assets/climateExpo.jpg";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PORT = 5050;

const pictures = {
  arcLogo: arcLogo,
  climateExpo: climateExpo, 
};

const stateMap = {
  1: "UPCOMING",
  2: "ONGOING",
  3: "NEWEST"
};

const characterLimit = 100;  

export default function EventList() {
  const [activeButton, setActiveButton] = useState(1);
  const [events, setEvents] = useState([]); 
   
  const handleActiveButtonChange = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  useEffect(() => {
    fetchEvents(stateMap[activeButton])
    console.log(stateMap[activeButton])
  }, [activeButton]) 

  const fetchEvents = async (state) => {
    try {
      const response = await fetch(`http://localhost:5050/event/eventList?state=${state}`);

      if (!response.ok) {
        console.log(response.json().message)
        throw new Error(`Could not fetch the events`);
      }

      const responseData = await response.json(); 

      setEvents(responseData.data); 
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="bg-[#FFF8D3] min-h-screen shadow-inner pl-10 pr-10 ">
      <div className="flex justify-start text-3xl text-[#6F6F6F] pt-5 pb-5">  
        Events
      </div>
      <div className="flex justify-between gap-10">
        <div className="flex"> 
          <div className="flex">
            <NavigationList onActiveButtonChange={handleActiveButtonChange}/>
          </div>
        </div>
        <div className='flex-grow'>
          <div className='text-3xl pb-16'>
            <div className='flex flex-col gap-8'> 
              {
                events.map((event) => (
                  <EventDetails
                    key = {event._id}
                    id = {event._id} 
                    picture = {event.picture}
                    title = {event.name} 
                    location = {makeDate(event.date) +" " + event.location.building + event.location.room}
                    body = {truncateText(event.body)} 
                  />
                ))
              }
            </div>
          </div>
        </div>
        <div className=' justify-center'>
          <div className='flex flex-col gap-4'>
            <SavedEvents/>
            <RecentlyViewed />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavigationList({ onActiveButtonChange }) {
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
    onActiveButtonChange(buttonIndex); 
  };


  return (
    <div className="bg-[#D9D9D9] p-4 rounded-[20px] h-[46rem] w-64 flex flex-col content-between gap-[465px]">
        <div className='flex flex-col gap-1'>  
          <div className='w-full'> 
            <Button
            label="Upcoming"
            variant={activeButton === 1 ? 'primary' : 'default'}
            onClick={() => handleButtonClick(1)}
            />
          </div>
          <div className='w-full'> 
            <Button
            label="Ongoing"
            variant={activeButton === 2 ? 'primary' : 'default'}
            onClick={() => handleButtonClick(2)}
            />
          </div>
          <div className='w-full'> 
            <Button
            label="Newest"
            variant={activeButton === 3 ? 'primary' : 'default'}
            onClick={() => handleButtonClick(3)}
            />
          </div> 
        </div>
        <div className=''> 
          <Button
          label="+ Add Event"
          variant={'eventAdd'}
          onClick = {() => handleSubmitEvent()}
          />
        </div>
    </div>
  );
}

const Button = ({ label, type = 'button', variant = 'primary', onClick }) => {
  
  const variants = {
    primary: 'bg-white font-bold font-large text-3xl',
    default: 'bg-[#D9D9D9] text-black hover:bg-gray-400 font-medium text-3xl',
    eventAdd: 'bg-orange-400 hover:bg-orange-500 text-3xl	', 
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-[14px] focus:outline-none ${variants[variant]} w-full mb-2`}
    >
      {label}
    </button>
  );
};

function EventDetails({id, picture, title, location, body}) {
  const navigate = useNavigate(); 

  console.log(title)
  const getPicture = (picture) => {
    return pictures[picture] || arcLogo; 
  };

  const openEventPage = () => {
    navigate(`/event/${id}`)
  }; 

  return (
    <div className="bg-[#EFD780] p-4 rounded-[30px] flex gap-8"
    onClick = { openEventPage }>
      
      <div className='w-80 h-60 flex-shrink-0'> 
        <img
          src= {getPicture(picture)}
          alt="Event picture"
          className="w-full h-full object-cover  rounded-[30px]"
        />

      </div>
      
      <div className="flex flex-col text-left">
        <div>
          <h1 className='flex font-bold text-4xl '>
            {title}
          </h1> 
        </div>
        <div className='flex text-2xl flex-col'>
          <div>
            {location}
          </div>
          <br />
          <div> 
            {body}
          </div>
          <div className='flex justify-end'>
            <DeleteButton
            id = {id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


function SavedEvents() {
  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-64 min-w-[440px] flex flex-col text-start">
      <div className='text-3xl'>
        Saved Events
      </div>
      <div className='flex flex-col gap-4'>
        <EventItem title="Reeeeee" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="Held by hopes and dreams" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title=":(" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
      </div>
    </div>
  );
}

function RecentlyViewed() {
  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-64 min-w-[440px] flex flex-col text-start">
      <div className='text-3xl text-start'>
        Recently Viewed 
      </div>
      <div className='flex flex-col gap-4'> 
        <EventItem title="Can someone" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="Think of a better color" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="Instead of gray" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="DevSoc Pizza Party" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
      </div>
    </div>
  );
}


function EventItem({title, body}) {
  return (
    <div className='bg-[#EFD780] min-h-16 rounded-[10px] min-w-[400px]	flex flex-col p-2'>
      <div className='font-medium	text-2xl	'>
        {title}
      </div>
      <div>
        {body}
      </div>
    </div>
  );
}

function truncateText(text) {
  if (!text) {
    return "NO TEXT PROVIDED"; 
  }

  if (text.length > characterLimit) {
    return text.slice(0, characterLimit) + "...";
  }
  return text;
}

function makeDate(date) {
  if (!date) {
    return "NO DATE PROVIDED"; 
  }

  if (date.length > 10) {
    return date.slice(0, 10);
  }

  return date;
}

function DeleteButton({id}) {


  const deleteEvent = async (e) => {
    e.preventDefault();
    try {
      console.log("the id is: " + id); 
      await axios.delete(`http://localhost:${PORT}/event/${id}`, {
        
      });
      console.log("Event deleted successfully");
      location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="justify-center flex items-center">
      <button
        className=" flex w-80 h-14 gap-2 p-5 bg-[#FF9980] z-10 rounded-[30px] justify-center items-center text-2xl"
        onClick = {deleteEvent}
      >
        Delete Event
      </button>
    </div>
  );
}
