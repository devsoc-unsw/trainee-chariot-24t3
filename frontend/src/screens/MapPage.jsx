"use client";

import { useEffect, useState } from "react";
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

function createMarker(map, poi, color) {
  const lngLat = Mazemap.Util.getPoiLngLat(poi);
  const marker = new Mazemap.MazeMarker({
    color: color,
    innerCircle: true,
    innerCircleColor: '#FFF',
    size: 34,
    innerCircleScale: 0.5,
    zLevel: poi.properties.zLevel
  })
  .setLngLat(lngLat)
  .addTo(map);

  marker.on("click", () => {
    marker.remove();
    createMarker(map, poi, "#000000");
  });
}

function useMazeMap() {
  const mapOptions = {
    container: "map",
    campuses: 111,
    center: { lng: 151.231232432, lat: -33.917529664 },
    zoom: 16.2,
    zLevel: 1,
  };

  const mySearch = new Mazemap.Search.SearchController({
    campusid: 111,
    rows: 10,
    withpois: true,
    withbuilding: false,
    withtype: false,
    withcampus: false,

    resultsFormat: "geojson",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.Mazemap) {
      const map = new window.Mazemap.Map(mapOptions);
      map.on('click', onMapClick);

      function onMapClick(e){
        const lngLat = e.lngLat;
        const zLevel = map.zLevel;

        Mazemap.Data.getPoiAt(lngLat, zLevel).then( poi => {
          createMarker(map, poi, "#ff00cc");
        }).catch( function(){ return false; } );
      }
    }
    // Ensure the search input exists before initializing the search
    const searchInputElement = document.getElementById("searchInput");
    if (searchInputElement) {
      const mySearchInput = new Mazemap.Search.SearchInput({
        container: document.getElementById("search-input-container"),
        input: searchInputElement,
        suggestions: document.getElementById("suggestions"),
        searchController: mySearch,
      }).on("itemclick", function (e) {
        searchInputElement.addEventListener("input", () => {
          mySearchInput.trigger();
        });
      });
    }
  }, []);
}

function AnchorTemporaryDrawer() {
  const router = useState();

  const [state, setState] = useState({
    left: false,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");

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
  };

  const handleSubmitEvent = () => {
    // send stuff to backend
    console.log("Event created:", { name: eventName, location: eventLocation });
    setOpenDialog(false);
    setEventName("");
    setEventLocation("");
  };

  const menuItems = [
    { text: "", icon: <CloseIcon />, action: "" },
    {
      text: "Create New Event",
      icon: <PlaceIcon />,
      action: handleCreateEvent,
    },
    { text: "Edit Event", icon: <CreateIcon />, action: "" },
    { text: "Saved", icon: <TurnedInIcon />, action: "" },
    { text: "Event List", icon: <ListAltIcon />, action: "/eventList" },
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
            <ListItemButton
              onClick={() =>
                typeof action === "function" ? action() : navigate(action)
              }
            >
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
          <div id="Event-Name-Container" style={{ paddingBottom: "2rem" }}>
            <input
              id="Event Name"
              className="search-input"
              type="text"
              name="Event"
              placeholder="Event Name"
            />
          </div>
          <div id="search-input-container" className="search-control-default">
            <form id="searchForm" className="search-form default">
              <input
                tabIndex="0"
                id="searchInput"
                className="search-input"
                autocomplete="off"
                type="text"
                name="search"
                placeholder="Location"
              />
            </form>
            <div id="suggestions" className="search-suggestions default"></div>
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
  useMazeMap();

  return (
    <div className="flex h-screen">
      <AnchorTemporaryDrawer />
      <div className="relative flex-grow w-screen h-screen rounded-lg shadow-lg overflow-hidden">
        <div id="map" className="absolute inset-0" />
      </div>
    </div>
  );
}
