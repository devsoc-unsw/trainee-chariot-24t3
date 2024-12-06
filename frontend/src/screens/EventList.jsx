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
  3: "NEWEST", 
  4: "MYEVENTS"
};

const characterLimit = 100;  
const sideCharLimit = 30; 

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
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5050/event/eventList?state=${state}&token=${token}`);

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
    <div className="bg-[#D9D9D9] p-4 rounded-[20px] h-[46rem] w-64 flex flex-col content-between gap-[400px] border-4 border-">
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
          <div className='w-full'> 
            <Button
            label="My Events"
            variant={activeButton === 4 ? 'primary' : 'default'}
            onClick={() => handleButtonClick(4)}
            />
          </div> 
          <div> 
            <Button
            label="+ Add Event"
            variant={'eventAdd'}
            onClick = {() => handleSubmitEvent()}
            />
          </div> 
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
  const [ownEvent, setownEvent] = useState(false); 

  const navigate = useNavigate(); 

  if (!localStorage.recentlyViewedEvents) {
    //RecentlyViewed Events is not initalised
    var recentlyViewedEvents = []; 
  } else {
    var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents);
  }


  console.log(title)
  const getPicture = (picture) => {
    return pictures[picture] || arcLogo; 
  };

  const openEventPage = () => {
    if (!recentlyViewedEvents.includes(id)) {
      recentlyViewedEvents.unshift(id); 
    }

    navigate(`/event/${id}`)
    localStorage.setItem("recentlyViewedEvents", JSON.stringify(recentlyViewedEvents))
  }; 
  
  useEffect(() => {
    //Find all events owned by the user, if the event id matches an event owned by the user
    //Then user will have option to delete or edit the event 
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:5050/event/eventList?state=MYEVENTS&token=${token}`);
  
        if (!response.ok) {
          console.log(response.json().message)
          throw new Error(`Could not fetch the events`);
        }
        
        const eventList = await response.json(); 
        console.log(eventList.data)
        console.log(id)
        for (const someEvent of eventList.data) {
          if (someEvent._id === id) {
            setownEvent(true);
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchEvents()
  }, [id])

  return (
    <div className="bg-[#EFD780] p-4 rounded-[30px] flex gap-8 hover:shadow-lg shadow-md">
      
      <div className='w-80 h-60 flex-shrink-0'> 
        <img
          src= {getPicture(picture)}
          alt="Event picture"
          className="w-full h-full object-cover  rounded-[30px]"
        />

      </div>
      <div className='flex flex-col flex-grow justify-between'> 
        <div className="flex flex-col text-left ">
          <div>
            <h1 className='flex font-bold text-4xl cursor-pointer hover:underline'
            onClick = { openEventPage }
            >
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
          </div>
        </div>

        <div className='flex justify-between gap-4'>
          <BookMarkButton
            id = {id}
          />
            
          {ownEvent === true &&(<EditButton
          id = {id}
          />)}
          
          {ownEvent === true &&(<DeleteButton
          id = {id}
          />)}
        </div>
      </div>
    
    </div>
  );
}


function SavedEvents() {
  if (!localStorage.bookMarkedEvents) {
    var bookMarkedEvents = [];
  } else {
    var bookMarkedEvents = JSON.parse(localStorage.bookMarkedEvents); 
  }

  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-40 min-w-[440px] flex flex-col text-start  border-4">
      <div className='text-3xl flex justify-center font-semibold'>
        Saved Events
      </div>
      <div className='flex flex-col gap-4'>
        {bookMarkedEvents.map((eventid) => (
          <EventItem
            eventId = {eventid}
          />
        ))}
        {bookMarkedEvents.length === 0 && (
          <div className="text-2xl text-gray-500 text-center p-4 italic ">
            No Saved Events
          </div>
        )}
      </div>
    </div>
  );
}

function RecentlyViewed() {
  if (!localStorage.recentlyViewedEvents) {
    //RecentlyViewed Events is not initalised
    var recentlyViewedEvents = []; 
  } else {
    var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents);
  } 

  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-40 min-w-[440px] flex flex-col text-start  border-4">
      <div className='text-3xl text-start font-semibold flex justify-center'>
        Recently Viewed 
      </div>
      <div className='flex flex-col gap-4'> 
        {recentlyViewedEvents.map((eventid) => (
          <EventItem 
            eventId = {eventid} 
          />
        ))}
        {recentlyViewedEvents.length === 0 && (
          <div className="text-2xl text-gray-500 text-center p-4 italic ">
            No Recently Viewed Events 
          </div>
        )}
      </div>
    </div>
  );
}


function EventItem({ eventId }) {
  const [event, setEvent] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchInfo(eventId)
  },[])

  const fetchInfo = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5050/event/${eventId}`);
      
      if (!response.ok) {
        console.log(response.json().message)
        throw new Error(`Could not fetch the events`);
      }

      const responseData = await response.json(); 

      setEvent(responseData.data); 
      console.log("REEEEEEEEEE" + responseData.data); 
    } catch (error) {
      console.log(error.message)
    }
  }

  const openEventPage = () => {
    navigate(`/event/${eventId}`)
  }; 

  return (
    <div className='bg-[#EFD780] min-h-16 rounded-[10px] min-w-[400px]	flex flex-col p-2 cursor-pointer hover:bg-[#E5C453]'
    onClick = { openEventPage }>
      <div className='font-medium	text-2xl	'>
        {truncateText(event.name, sideCharLimit)}
      </div>
      <div>
        {event.date}
      </div>
    </div>
  );
}

function truncateText(text, value) {
  if (!value) {
    value = characterLimit; 
  }

  if (!text) {
    return "NO TEXT PROVIDED"; 
  }

  if (text.length > value) {
    return text.slice(0, value) + "...";
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
  if (!localStorage.recentlyViewedEvents) {
    var recentlyViewedEvents = []; 
  } else {
    var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents); 
  }

  if (!localStorage.bookMarkedEvents) {
    var bookMarkedEvents = [];
  } else {
    var bookMarkedEvents = JSON.parse(localStorage.bookMarkedEvents); 
  }

  const deleteEvent = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      console.log("the id is: " + id); 
      await axios.delete(`http://localhost:${PORT}/event/${id}`, {
      });
      console.log("Event deleted successfully");

      recentlyViewedEvents = recentlyViewedEvents.filter(event => event !== id); 
      bookMarkedEvents = bookMarkedEvents.filter(event => event !== id); 

      localStorage.bookMarkedEvents = JSON.stringify(bookMarkedEvents);
      localStorage.recentlyViewedEvents = JSON.stringify(recentlyViewedEvents);

      location.reload();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="cursor-pointer pointer-events-auto flex justify-end w-full">
      <button
        className=" flex w-full h-14 gap-2 p-5 bg-[#FF9980] hover:bg-[#FF8066] z-10 rounded-[20px] justify-center items-center text-2xl pointer-events-auto"
        onClick = {deleteEvent}
      >
        Delete Event
      </button>
    </div>
  );
}

function EditButton({id}) {

  return (
    <div className="cursor-pointer pointer-events-auto w-full">
      <button
        className=" flex w-full h-14 gap-2 p-5 bg-[#FFB800] hover:bg-[#E6A800] z-10 rounded-[20px] justify-center items-center text-2xl pointer-events-auto"
        // onClick = {deleteEvent}
      >
        Edit Event 
      </button>
    </div>
  );
}

function BookMarkButton({id}) {
  const [booked, setBooked] = useState(false); 

  if (!localStorage.recentlyViewedEvents) {
    var recentlyViewedEvents = []; 
  } else {
    var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents); 
  }

  if (!localStorage.bookMarkedEvents) {
    var bookMarkedEvents = [];
  } else {
    var bookMarkedEvents = JSON.parse(localStorage.bookMarkedEvents); 
  }


  useEffect(() => {    
    if (bookMarkedEvents.includes(id)) {
      setBooked(true); 
    }  
  }, [id])


  const bookMarkEvent = () => {
    if (!bookMarkedEvents.includes(id)) {
      setBooked(true)
      bookMarkedEvents.unshift(id); 
    } else {
      //Already included bookmark
      //So we must delete the bookmark 
      setBooked(false);  
      bookMarkedEvents = bookMarkedEvents.filter(eventId => eventId !== id); 
    }

    location.reload()
    localStorage.setItem("bookMarkedEvents", JSON.stringify(bookMarkedEvents))
  }; 

  return (
    <div className="justify-center flex cursor-pointer pointer-events-auto w-full">
      <button
        className=" flex w-full h-14 gap-2 p-5 bg-[#ADD8E6] hover:bg-[#94CAE1] z-10 rounded-[20px] justify-center items-center text-2xl pointer-events-auto"
        onClick = {bookMarkEvent}
      > 
        {booked === false && (
          <div>
            Bookmark Event
          </div>
        )}
        {booked === true && (
          <div>
            Bookmarked
          </div>
        )}
         
      </button>
    </div>
  );
}