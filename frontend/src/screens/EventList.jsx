import React, { useState, useEffect, useRef } from "react";
import arcLogo from "../assets/arcLogo.jpg";
import climateExpo from "../assets/climateExpo.jpg";
import axios from "axios";
import { useFetcher, useNavigate } from "react-router-dom";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NewButton from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, useEventCallback } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const PORT = 5050;

const pictures = {
  arcLogo: arcLogo,
  climateExpo: climateExpo,
};

const stateMap = {
  1: "UPCOMING",
  2: "ONGOING",
  3: "NEWEST",
  4: "MYEVENTS",
};

const characterLimit = 100;
const sideCharLimit = 30;

export default function EventList() {
  const [activeButton, setActiveButton] = useState(1);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [bookmarked, setBookMarked] = useState([]);
  const [tempEvents, setTempEvents] = useState([]);

  const handleActiveButtonChange = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  useEffect(() => {
    //Gets all the events that exist at the start
    const getAllEvents = async () => {
      const data = await fetchEvents("NEWEST");
      setAllEvents(data);
    };

    getAllEvents();
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents(stateMap[activeButton]);
      setEvents(data);
    };

    getEvents();
  }, [activeButton]);

  //Get all bookmarked events once at the initalisation
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("bookMarkedEvents"));

    if (!storedEvents) {
      setBookMarked([]);
      setTempEvents([]);
      console.log("No bookmarked events");
    } else {
      console.log("The stored events are: ", storedEvents);
      setBookMarked(storedEvents);
      setTempEvents(storedEvents);
      console.log("Some bookmarked");
    }

    console.log("The setbookmarked function is " + bookmarked);
  }, []);

  useEffect(() => {
    if (bookmarked.length !== 0 && allEvents.length !== 0) {
      let newBookMark = [];
      for (const bookmark of bookmarked) {
        for (const event of allEvents) {
          if (event._id === bookmark) {
            newBookMark.push(bookmark);
            continue;
          }
        }
      }

      setBookMarked(newBookMark);
      localStorage.bookMarkedEvents = JSON.stringify(newBookMark);
    }
  }, [tempEvents, allEvents]);

  const fetchEvents = async (state) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5050/event/eventList?state=${state}&token=${token}`
      );

      if (!response.ok) {
        console.log(response.json().message);
        throw new Error(`Could not fetch the events`);
      }

      const responseData = await response.json();

      return responseData.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-[#FFF3E2] min-h-screen shadow-inner pl-10 pr-10 ">
      <div className="flex justify-start text-3xl text-[#6F6F6F] pt-5 pb-5">
        Events
      </div>
      <div className="flex justify-between gap-10">
        <div className="flex">
          <div className="flex">
            <NavigationList onActiveButtonChange={handleActiveButtonChange} />
          </div>
        </div>
        <div className="flex-grow">
          <div className="text-3xl pb-16">
            <div className="flex flex-col gap-8">
              {events.map((event) => (
                <EventDetails
                  key={event._id}
                  id={event._id}
                  picture={event.imageUrl}
                  title={event.name}
                  location={
                    makeDate(event.date) +
                    " | " +
                    event.location.room.replace(/<[^>]*>/g, "") +
                    " " +
                    event.location.building.replace(/<[^>]*>/g, "")
                  }
                  body={truncateText(event.desc)}
                  time={
                    new Date(event.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }) +
                    "-" +
                    new Date(event.endTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  }
                  events={events}
                  setEvents={setEvents}
                  owner={event.token}
                  bookmarked={bookmarked}
                  setBookMarked={setBookMarked}
                />
              ))}
              {events.length === 0 && (
                <div className="flex justify-center pt-8">No events</div>
              )}
            </div>
          </div>
        </div>
        <div className=" justify-center">
          <div className="flex flex-col gap-4">
            <SavedEvents bookmarked={bookmarked} allEvents={allEvents} />
            <RecentlyViewed allEvents={allEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavigationList({ onActiveButtonChange }) {
  const [activeButton, setActiveButton] = useState(1);
  const [showingEdit, setShowingEdit] = useState(false);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
    onActiveButtonChange(buttonIndex);
  };

  return (
    <div className="bg-[#D9D9D9] p-4 rounded-[20px] h-[46rem] w-64 flex flex-col content-between gap-[400px] border-4 border-">
      <div className="flex flex-col gap-1">
        <div className="w-full">
          <Button
            label="Upcoming"
            variant={activeButton === 1 ? "primary" : "default"}
            onClick={() => handleButtonClick(1)}
          />
        </div>
        <div className="w-full">
          <Button
            label="Ongoing"
            variant={activeButton === 2 ? "primary" : "default"}
            onClick={() => handleButtonClick(2)}
          />
        </div>
        <div className="w-full">
          <Button
            label="Newest"
            variant={activeButton === 3 ? "primary" : "default"}
            onClick={() => handleButtonClick(3)}
          />
        </div>
      </div>
      <div className="">
        <div className="w-full">
          <Button
            label="My Events"
            variant={activeButton === 4 ? "primary" : "default"}
            onClick={() => handleButtonClick(4)}
          />
        </div>
        <div>
          <Button
            label="+ Add Event"
            variant={"eventAdd"}
            onClick={() => {
              setShowingEdit(true);
            }}
          />
          {showingEdit && (
            <MakeEvent
              openDialog={showingEdit}
              setOpenDialog={setShowingEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MakeEvent({ openDialog, setOpenDialog }) {
  // const [openDialog, setOpenDialog] = useState(false)

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [eventStart, setEventStart] = useState(null);
  const [eventEnd, setEventEnd] = useState(null);
  const [eventLocation, setEventLocation] = useState({
    lat: null,
    lng: null,
    building: "",
    room: "",
  });
  const [eventDesc, setEventDesc] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const { searchInputRef, suggestionsRef } = useMazeMap(setEventLocation);

  const handleCreateEvent = () => {
    setOpenDialog(true);
    setState({ ...state, left: false });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEventName("");
    setEventDate(null);
    setEventStart(null);
    setEventEnd(null);
    setEventLocation("");
    setEventDesc("");
    setThumbnailUrl("");
  };

  const handleSubmitEvent = async () => {
    if (!eventLocation.lat || !eventLocation.lng) {
      console.log(eventLocation);
      alert("Please select a valid location from the map search box.");
      return;
    }

    const token = localStorage.getItem("token");

    const eventData = {
      name: eventName,
      date: eventDate,
      startTime: eventStart,
      endTime: eventEnd,
      location: eventLocation,
      token: token,
      desc: eventDesc,
      imageUrl: thumbnailUrl,
    };

    try {
      const response = await fetch("http://localhost:5050/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        console.log(response.data);
        alert(
          "Event created successfully! Please restart your page to see the event"
        );
        handleCloseDialog();
      } else {
        consoles.log(response);
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event. Please try again.");
    }
  };

  return (
    <div className="absolute top-auto left-auto z-10">
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{ borderRadius: "16px" }}
      >
        <DialogTitle style={{ backgroundColor: "#CFCFCF" }}>
          Create New Event
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#CFCFCF" }}>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              autoComplete="off"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                <DatePicker
                  label="Event Date"
                  value={eventDate}
                  onChange={(newValue) => setEventDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth sx={{ marginRight: 4 }} />
                  )}
                />
                <TimePicker
                  label="Event Start"
                  value={eventStart}
                  onChange={(newValue) => setEventStart(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <TimePicker
                  label="Event End"
                  value={eventEnd}
                  onChange={(newValue) => setEventEnd(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
            </LocalizationProvider>
            <div id="search-input-container" className="search-control-default">
              <TextField
                fullWidth
                label="Location"
                inputRef={searchInputRef}
                autoComplete="off"
              />
              <div
                ref={suggestionsRef}
                id="suggestions"
                className="search-suggestions default"
              ></div>
            </div>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              fullWidth
              label="Event Description"
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              autoComplete="off"
            />
            <TextField
              fullWidth
              label="Thumbnail URL"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              autoComplete="off"
            />
          </div>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#CFCFCF", color: "black" }}>
          <NewButton onClick={handleCloseDialog} style={{ color: "black" }}>
            Cancel
          </NewButton>
          <NewButton onClick={handleSubmitEvent} style={{ color: "black" }}>
            Create
          </NewButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Button = ({ label, type = "button", variant = "primary", onClick }) => {
  const variants = {
    primary: "bg-white font-bold font-large text-3xl",
    default: "bg-[#D9D9D9] text-black hover:bg-gray-400 font-medium text-3xl",
    eventAdd: "bg-orange-400 hover:bg-orange-500 text-3xl	",
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

function EventDetails({
  id,
  picture,
  title,
  location,
  body,
  time,
  events,
  setEvents,
  owner,
  bookmarked,
  setBookMarked,
}) {
  const [ownEvent, setownEvent] = useState(false);

  const navigate = useNavigate();

  if (!localStorage.recentlyViewedEvents) {
    //RecentlyViewed Events is not initalised
    var recentlyViewedEvents = [];
  } else {
    var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents);
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

  const openEventPage = () => {
    if (!localStorage.recentlyViewedEvents) {
      //RecentlyViewed Events is not initalised
      var recentlyViewedEvents = [];
    } else {
      var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents);
    }

    if (!recentlyViewedEvents.includes(id)) {
      recentlyViewedEvents.unshift(id);
    }

    navigate(`/event/${id}`);
    localStorage.setItem(
      "recentlyViewedEvents",
      JSON.stringify(recentlyViewedEvents)
    );
  };

  useEffect(() => {
    //Find all events owned by the user, if the event id matches an event owned by the user
    //Then user will have option to delete or edit the event

    const token = localStorage.getItem("token");
    if (token === owner) {
      setownEvent(true);
    }
  }, []);

  return (
    <div className="bg-[#EFD780] p-4 rounded-[30px] flex gap-8 hover:shadow-lg shadow-md">
      <div className="w-80 h-60 flex-shrink-0">
        <img
          src={getPicture(picture)}
          alt="Event picture"
          className="w-full h-full object-cover  rounded-[30px]"
        />
      </div>
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-col text-left ">
          <div>
            <h1
              className="flex font-bold text-4xl cursor-pointer hover:underline"
              onClick={openEventPage}
            >
              {title}
            </h1>
          </div>
          <div className="flex text-2xl flex-col ">
            <div className="flex items-center">
              <AccessTimeIcon /> {time} | <DateRangeIcon />
              {location}
            </div>
            <br />
            <div>{body}</div>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <BookMarkButton
            id={id}
            bookmarked={bookmarked}
            setBookMarked={setBookMarked}
          />

          {ownEvent === true && <EditButton id={id} />}

          {ownEvent === true && (
            <DeleteButton
              id={id}
              events={events}
              setEvents={setEvents}
              bookmarked={bookmarked}
              setBookMarked={setBookMarked}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SavedEvents({ bookmarked, allEvents }) {
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    setSavedEvents(bookmarked);
  }, [bookmarked]);

  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-40 min-w-[440px] flex flex-col text-start  border-4">
      <div className="text-3xl flex justify-center font-semibold">
        Saved Events
      </div>
      <div className="flex flex-col gap-4">
        {savedEvents.map((eventid) => (
          <EventItem eventId={eventid} allEvents={allEvents} />
        ))}
        {savedEvents.length === 0 && (
          <div className="text-2xl text-gray-500 text-center p-4 italic ">
            No Saved Events
          </div>
        )}
      </div>
    </div>
  );
}

function RecentlyViewed({ allEvents }) {
  const [deleteEvent, setDeleteEvent] = useState(false);

  if (!localStorage.recentlyViewedEvents) {
    //RecentlyViewed Events is not initalised
    var recentlyViewedEvents = [];
  } else {
    var recentlyViewedEvents = JSON.parse(localStorage.recentlyViewedEvents);
  }

  const clearHistory = () => {
    localStorage.recentlyViewedEvents = JSON.stringify([]);
  };

  useEffect(() => {
    if (deleteEvent == true) {
      clearHistory();
    }

    setDeleteEvent(false);
  }, [deleteEvent]);

  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-40 min-w-[440px] flex flex-col text-start  border-4">
      <div className="text-3xl text-start font-semibold flex justify-center">
        Recently Viewed
      </div>
      <div className="flex flex-col gap-4">
        {recentlyViewedEvents.map((eventid) => (
          <EventItem eventId={eventid} allEvents={allEvents} />
        ))}
        {recentlyViewedEvents.length !== 0 && (
          <div
            className="text-2xl text-white-500 text-center p-4 mouse-pointer cursor-pointer hover:underline"
            onClick={() => setDeleteEvent(true)}
          >
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

function EventItem({ eventId, allEvents }) {
  const [event, setEvent] = useState([]);
  const [day, setDay] = useState([""]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = () => {
      const foundEvent = allEvents.find((event) => event._id === eventId);

      if (foundEvent) {
        const weekday = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const date = new Date(foundEvent.date);
        const options = {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        };

        const formattedDate = date.toLocaleDateString("en-US", options);
        setDay(formattedDate);
        setEvent(foundEvent);
      } else {
        //If the event does not exist, then do not display any event!
        setEvent(null);
      }
    };

    fetchInfo();
  }, [eventId, allEvents]);

  const openEventPage = () => {
    navigate(`/event/${eventId}`);
  };

  if (!event) {
    return null;
  }

  return (
    <div
      className="bg-[#EFD780] min-h-16 rounded-[10px]	flex flex-col p-2 cursor-pointer hover:bg-[#E5C453]"
      onClick={openEventPage}
    >
      <div className="font-medium	text-2xl	">
        {truncateText(event.name, sideCharLimit)}
      </div>
      <div>
        {new Date(event.startTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}{" "}
        {day}
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

function DeleteButton({ id, events, setEvents, bookmarked, setBookMarked }) {
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
      await axios.delete(`http://localhost:${PORT}/event/${id}`, {});

      recentlyViewedEvents = recentlyViewedEvents.filter(
        (event) => event !== id
      );
      bookMarkedEvents = bookMarkedEvents.filter((event) => event !== id);

      localStorage.bookMarkedEvents = JSON.stringify(bookMarkedEvents);
      localStorage.recentlyViewedEvents = JSON.stringify(recentlyViewedEvents);

      setEvents(events.filter((event) => event._id !== id));

      setBookMarked(bookmarked.filter((eventId) => eventId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="cursor-pointer pointer-events-auto flex justify-end w-full">
      <button
        className=" flex w-full h-14 gap-2 p-5 bg-[#FF9980] hover:bg-[#FF8066] z-10 rounded-[20px] justify-center items-center text-2xl pointer-events-auto"
        onClick={deleteEvent}
      >
        <DeleteIcon /> Delete Event
      </button>
    </div>
  );
}

function useMazeMap(setEventLocation) {
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchInputInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Mazemap) return;

    const mySearch = new window.Mazemap.Search.SearchController({
      campusid: 111,
      rows: 10,
      withpois: true,
      withbuilding: false,
      withtype: false,
      withcampus: false,
      resultsFormat: "geojson",
    });

    const initializeSearch = () => {
      if (searchInputRef.current && suggestionsRef.current) {
        const mySearchInput = new window.Mazemap.Search.SearchInput({
          container: document.getElementById("search-input-container"),
          input: searchInputRef.current,
          suggestions: suggestionsRef.current,
          searchController: mySearch,
        });

        mySearchInput.on("itemclick", (e) => {
          const { geometry, properties } = e.item;
          setEventLocation({
            lat: geometry.coordinates[1],
            lng: geometry.coordinates[0],
            building: properties.dispBldNames[0] || "",
            room: properties.dispPoiNames[0] || "",
            title: properties.title || "",
          });
        });

        searchInputInstanceRef.current = mySearchInput;
        searchInputRef.current.addEventListener("input", () => {
          searchInputInstanceRef.current?.trigger();
        });
      } else {
        setTimeout(initializeSearch, 100);
      }
    };

    initializeSearch();
  }, []);

  return { searchInputRef, suggestionsRef };
}

function EditButton({ id }) {
  const [showingEdit, setShowingEdit] = useState(false);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    console.log("Fetching event data");
    fetchInfo(id);
  }, []);

  const fetchInfo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5050/event/${id}`);

      if (!response.ok) {
        console.log(response.json().message);
        throw new Error(`Could not fetch the events`);
      }

      const responseData = await response.json();
      setEvent(responseData.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="cursor-pointer pointer-events-auto w-full">
      <button
        className=" flex w-full h-14 gap-2 p-5 bg-[#FFB800] hover:bg-[#E6A800] z-10 rounded-[20px] justify-center items-center text-2xl pointer-events-auto"
        onClick={() => {
          setShowingEdit(true);
        }}
      >
        <EditIcon />
        Edit Event
      </button>
      {showingEdit && (
        <EditScreen
          event={event}
          openDialog={showingEdit}
          setOpenDialog={setShowingEdit}
        />
      )}
    </div>
  );
}

function EditScreen({ event, openDialog, setOpenDialog }) {
  // const [openDialog, setOpenDialog] = useState(false)

  const [eventName, setEventName] = useState(event.name);
  const [eventDate, setEventDate] = useState(new Date(event.date));
  const [eventStart, setEventStart] = useState(new Date(event.startTime));
  const [eventEnd, setEventEnd] = useState(new Date(event.endTime));
  const [eventLocation, setEventLocation] = useState(event.location);
  const [eventDesc, setEventDesc] = useState(event.desc);
  const [thumbnailUrl, setThumbnailUrl] = useState(event.imageUrl);
  const { searchInputRef, suggestionsRef } = useMazeMap(setEventLocation);

  const handleCreateEvent = () => {
    setOpenDialog(true);
    setState({ ...state, left: false });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEventName("");
    setEventDate(null);
    setEventStart(null);
    setEventEnd(null);
    setEventLocation("");
    setEventDesc("");
    setThumbnailUrl("");
  };

  const handleSubmitEvent = async () => {
    if (!eventLocation.lat || !eventLocation.lng) {
      alert("Please select a valid location from the map search box.");
      return;
    }

    const token = localStorage.getItem("token");

    const eventData = {
      name: eventName,
      date: eventDate,
      startTime: eventStart,
      endTime: eventEnd,
      location: eventLocation,
      token: token,
      desc: eventDesc,
      imageUrl: thumbnailUrl,
    };

    try {
      const response = await fetch(`http://localhost:5050/event/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        console.log(response.data);
        alert("Event updated successfully!");
        handleCloseDialog();
        location.reload();
      } else {
        console.log(response);
        alert("Failed to update event. Please try again.");
      }
    } catch (error) {
      console.log("Error updating event:", error);
      alert("An error occurred while updating the event. Please try again.");
    }
  };

  return (
    <div className="absolute top-auto left-auto z-10">
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{ borderRadius: "16px" }}
      >
        <DialogTitle style={{ backgroundColor: "#CFCFCF" }}>
          Edit Event
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#CFCFCF" }}>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              autoComplete="off"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                <DatePicker
                  label="Event Date"
                  value={eventDate}
                  onChange={(newValue) =>
                    setEventDate(newValue) + console.log(newValue)
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth sx={{ marginRight: 4 }} />
                  )}
                />
                <TimePicker
                  label="Event Start"
                  value={eventStart}
                  onChange={(newValue) => setEventStart(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <TimePicker
                  label="Event End"
                  value={eventEnd}
                  onChange={(newValue) => setEventEnd(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
            </LocalizationProvider>
            <div id="search-input-container" className="search-control-default">
              <TextField
                fullWidth
                label="Location"
                defaultValue={event.location.room.replace(/<[^>]*>/g, "")}
                //To change to location.title when all events have a title field
                inputRef={searchInputRef}
                autoComplete="off"
              />
              <div
                ref={suggestionsRef}
                id="suggestions"
                className="search-suggestions default"
              ></div>
            </div>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              fullWidth
              label="Event Description"
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              autoComplete="off"
            />
            <TextField
              fullWidth
              label="Thumbnail URL"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              autoComplete="off"
            />
          </div>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#CFCFCF", color: "black" }}>
          <NewButton onClick={handleCloseDialog} style={{ color: "black" }}>
            Cancel
          </NewButton>
          <NewButton onClick={handleSubmitEvent} style={{ color: "black" }}>
            Edit Event
          </NewButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function BookMarkButton({ id, bookmarked, setBookMarked }) {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (bookmarked.includes(id)) {
      setBooked(true);
    }
  }, []);

  const bookMarkEvent = () => {
    let newBookmarked = [];

    if (!bookmarked.includes(id)) {
      newBookmarked = [...bookmarked, id];
      setBooked(true);
    } else {
      //Already included bookmark
      //So we must delete the bookmark
      newBookmarked = bookmarked.filter((eventId) => eventId !== id);

      setBooked(false);
    }

    setBookMarked(newBookmarked);
    localStorage.setItem("bookMarkedEvents", JSON.stringify(newBookmarked));
  };

  return (
    <div className="justify-center flex cursor-pointer pointer-events-auto w-full">
      <button
        className=" flex w-full h-14 gap-2 p-5 bg-[#ADD8E6] hover:bg-[#94CAE1] z-10 rounded-[20px] justify-center items-center text-2xl pointer-events-auto"
        onClick={bookMarkEvent}
      >
        {booked === false && (
          <div className="flex items-center">
            <BookmarkAddIcon /> &nbsp;Bookmark
          </div>
        )}
        {booked === true && (
          <div className="flex items-center">
            <BookmarkAddedIcon /> &nbsp;Bookmarked
          </div>
        )}
      </button>
    </div>
  );
}
