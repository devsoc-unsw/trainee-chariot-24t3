import React, { useState, useEffect } from 'react';
import arcLogo from "../assets/arcLogo.jpg";
import climateExpo from "../assets/climateExpo.jpg";
import axios from "axios";
import { useFetcher, useNavigate } from 'react-router-dom';

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
  const [bookmarked, setBookMarked] = useState([]); 
  

  const handleActiveButtonChange = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  useEffect(() => {
    fetchEvents(stateMap[activeButton])
   
  }, [activeButton]) 

  //Get all bookmarked events once at the initalisation 
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("bookMarkedEvents"));

    if (!storedEvents) {
      setBookMarked([]);
    } else {
      setBookMarked(storedEvents); 
    }
  }, [])
  
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
                    location = {makeDate(event.date) + " | " + event.location.building.replace(/<[^>]*>/g, '') + event.location.room.replace(/<[^>]*>/g, '')}
                    body = {truncateText(event.body)}
                    time = {new Date(event.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} 
                    events = {events}
                    setEvents = {setEvents}
                    owner = {event.token}
                    bookmarked = {bookmarked} 
                    setBookMarked = {setBookMarked}
                  />
                ))
              }
            </div>
          </div>
        </div>
        <div className=' justify-center'>
          <div className='flex flex-col gap-4'>
            <SavedEvents
              bookmarked = {bookmarked}
            />
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

function EventDetails({id, picture, title, location, body, time, events, setEvents, owner, bookmarked, setBookMarked}) {
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
    
    const token = localStorage.getItem("token")
    if (token === owner) {
      setownEvent(true); 
    }
  }, [])

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
          <div className='flex text-2xl flex-col '>
            <div className='flex items-center'>
              <AccessTimeIcon/> {time} | <DateRangeIcon/>{location} 
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
            bookmarked = {bookmarked} 
            setBookMarked = {setBookMarked}
          />
            
          {ownEvent === true &&(<EditButton
          id = {id}
          />)}
          
          {ownEvent === true &&(<DeleteButton
          id = {id}
          events = {events}
          setEvents = {setEvents} 
          />)}
        </div>
      </div>
    
    </div>
  );
}


function SavedEvents({bookmarked}) {

  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-40 min-w-[440px] flex flex-col text-start  border-4">
      <div className='text-3xl flex justify-center font-semibold'>
        Saved Events
      </div>
      <div className='flex flex-col gap-4'>
        {bookmarked.map((eventid) => (
          <EventItem
            eventId = {eventid}
          />
        ))}
        {bookmarked.length === 0 && (
          <div className="text-2xl text-gray-500 text-center p-4 italic ">
            No Saved Events
          </div>
        )}
      </div>
    </div>
  );
}

function RecentlyViewed() {
  const [deleteEvent, setDeleteEvent] = useState(false); 

  if (!localStorage.recentlyViewedEvents) {
    //RecentlyViewed Events is not initalised
    var recentlyViewedEvents = []; 
  } else {
    var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents);
  } 

  const clearHistory = () => {
    localStorage.recentlyViewedEvents = JSON.stringify([]); 
  }

  useEffect(() => {
    if (deleteEvent == true) {
      clearHistory();
    }

    setDeleteEvent(false) 
  }, [deleteEvent])

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
        {recentlyViewedEvents.length !== 0 && (
          <div className="text-2xl text-white-500 text-center p-4 mouse-pointer cursor-pointer hover:underline"
          onClick = {() => setDeleteEvent(true)} >
            Clear History
          </div>
        )}
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
  const [day, setDay] = useState([""]);

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

      const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const date = new Date(responseData.data.time); 
      setDay(weekday[date.getDay()])  

    } catch (error) {
      console.log(error.message)
    }
  }

  const openEventPage = () => {
    navigate(`/event/${eventId}`)
  }; 


  return (
    <div className='bg-[#EFD780] min-h-16 rounded-[10px]	flex flex-col p-2 cursor-pointer hover:bg-[#E5C453]'
    onClick = { openEventPage }>
      <div className='font-medium	text-2xl	'>
        {truncateText(event.name, sideCharLimit)}
      </div>
      <div>
      {new Date(event.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} {day} | {makeDate(event.date)}
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

function DeleteButton({id, events, setEvents}) {
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
      
      setEvents(events.filter(event => event._id !== id)); 

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
        <DeleteIcon/> Delete Event
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
        <EditIcon/>Edit Event 
      </button>
    </div>
  );
}

function BookMarkButton({id, bookmarked, setBookMarked}) {
  const [booked, setBooked] = useState(false); 

  useEffect(() => {    
    if (bookmarked.includes(id)) {
      setBooked(true); 
    }  
  }, [id, bookmarked])


  const bookMarkEvent = () => {
    let newBookmarked = []; 

    if (!bookmarked.includes(id)) {
      newBookmarked = [id, ...bookmarked];
      setBooked(true)
    } else {
      //Already included bookmark
      //So we must delete the bookmark 
      newBookmarked = bookmarked.filter(eventId => eventId !== id); 

      setBooked(false);  
    }

    setBookMarked(newBookmarked)
    localStorage.setItem("bookMarkedEvents", JSON.stringify(newBookmarked))
  }; 

  return (
    <div className="justify-center flex cursor-pointer pointer-events-auto w-full">
      <button
        className=" flex w-full h-14 gap-2 p-5 bg-[#ADD8E6] hover:bg-[#94CAE1] z-10 rounded-[20px] justify-center items-center text-2xl pointer-events-auto"
        onClick = {bookMarkEvent}
      > 
        {booked === false && (
          <div className='flex items-center'>
            <BookmarkAddIcon/> &nbsp;Bookmark
          </div>
        )}
        {booked === true && (
          <div className='flex items-center'>
            <BookmarkAddedIcon/> &nbsp;Bookmarked
          </div>
        )}
         
      </button>
    </div>
  );
}