"use client";

import { useEffect, useState, useRef } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlaceIcon from "@mui/icons-material/Place";
import CreateIcon from "@mui/icons-material/Create";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate } from "react-router-dom";

function createMarker(
  coord,
  map,
  zLevel,
  color,
  eventName,
  eventLocation,
  eventTime
) {
  const marker = new Mazemap.MazeMarker({
    color: color,
    innerCircle: true,
    innerCircleColor: "#FFF",
    size: 34,
    innerCircleScale: 0.5,
    zLevel: zLevel,
    preventClickBubble: false,
  })
    .setLngLat(coord)
    .addTo(map);

  marker.on("click", () => {
    marker.remove();
    createMarker(
      coord,
      map,
      zLevel,
      color,
      eventName,
      eventLocation,
      eventTime
    );

    new Mazemap.Popup({ closeOnClick: true, offset: [0, -25] })
      .setLngLat(marker.getLngLat())
      .setHTML(
        `<h3 style="font-weight: bold">${eventName}</h3>
                <p style="max-width: 160px;">${eventLocation}</p>
                <p style="max-width: 160px;">${eventTime}</p>`
      )
      .addTo(map);
  });
}

async function allOngoingEvents() {
  try {
    const token = localStorage.getItem("token");
    // hardcoded the state to be "ONGOING"
    const response = await fetch(
      "http://localhost:5050/event/eventList?state=ONGOING&token=${token}"
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
  // in case no ongoing events, just return an empty array
  return [];
}

function useMazeMap(setEventLocation) {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchInputInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Mazemap) return;

    const mapOptions = {
      container: "map",
      campuses: 111,
      center: { lng: 151.231232432, lat: -33.917529664 },
      zoom: 16.2,
      zLevel: 1,
    };

    const map = new window.Mazemap.Map(mapOptions);
    map.addControl(new window.Mazemap.mapboxgl.NavigationControl());

    allOngoingEvents().then((data) => {
      data.forEach((item) => {
        const lngLat = { lng: item.location.lng, lat: item.location.lat };
        const zLevel = map.zLevel;
        const name = item.name;
        const location = `${item.location.building}, ${item.location.room}`;
        let time = "";
        if (item.startTime && item.endTime) {
          time = `${new Date(item.startTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })} - ${new Date(item.endTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`;
        }
        createMarker(lngLat, map, zLevel, "#ff00cc", name, location, time);
      });
      console.log(data);
    });

    // map.on('click', onMapClick);

    // function onMapClick(e){
    //   const lngLat = e.lngLat;
    //   const zLevel = map.zLevel;
    //   createMarker(lngLat, map, zLevel, "#ff00cc", "DevSoc Event", "Blockhouse, G034", "");
    // }

    mapRef.current = map;

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

        mySearchInput.on("itemclick", function (e) {
          const selectedResult = e.item;
          if (selectedResult) {
            const { geometry, properties } = selectedResult;
            setEventLocation({
              lat: geometry.coordinates[1],
              lng: geometry.coordinates[0],
              building: properties.buildingname || "",
              room: properties.title || "",
              // building: properties.dispBldNames[0] || '',
              // room: properties.dispPoiNames[0] || '',
              // title: properties.title || ''
            });
            console.log(e);
            console.log("hi");
          }
        });

        searchInputInstanceRef.current = mySearchInput;

        searchInputRef.current.addEventListener("input", () => {
          if (searchInputInstanceRef.current) {
            searchInputInstanceRef.current.trigger();
          }
        });
      } else {
        setTimeout(initializeSearch, 100);
      }
    };

    initializeSearch();

    return () => {
      map.remove();
    };
  }, []);

  return { searchInputRef, suggestionsRef };
}

function AnchorTemporaryDrawer() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    left: false,
  });

  const [openDialog, setOpenDialog] = useState(false);

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

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

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
        alert("Event created successfully!");
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

  const menuItems = [
    { text: "", icon: <CloseIcon />, action: toggleDrawer("left", false) },
    {
      text: "Create New Event",
      icon: <PlaceIcon />,
      action: handleCreateEvent,
    },
    // { text: "Edit Event", icon: <CreateIcon />, action: () => {} },
    // { text: "Saved", icon: <TurnedInIcon />, action: () => {} },
    {
      text: "Event List",
      icon: <ListAltIcon />,
      action: () => {
        navigate("/eventList");
      },
    },
  ];

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {menuItems.map(({ text, icon, action }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={action}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div className="absolute top-auto left-auto z-10">
      <Button onClick={toggleDrawer("left", true)}>
        <MenuIcon className="text-black" />
      </Button>
      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer("left", false)}
      >
        {list("left")}
      </Drawer>
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
        <DialogActions style={{ backgroundColor: "#CFCFCF" }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitEvent}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function MapPage() {
  return (
    <div className="flex h-screen">
      <AnchorTemporaryDrawer />
      <div className="relative flex-grow w-screen h-screen rounded-lg shadow-lg overflow-hidden">
        <div id="map" className="absolute inset-0" />
      </div>
    </div>
  );
}
