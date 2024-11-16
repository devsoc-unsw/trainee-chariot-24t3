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
import { useNavigate } from "react-router-dom";

function useMazeMap() {
  const mapRef = useRef(null)
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const searchInputInstanceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Mazemap) return

    const mapOptions = {
      container: 'map',
      campuses: 111,
      center: { lng: 151.231232432, lat: -33.917529664 },
      zoom: 16.2,
      zLevel: 1,
    }

    const map = new window.Mazemap.Map(mapOptions)
    map.addControl(new window.Mazemap.mapboxgl.NavigationControl())
    mapRef.current = map

    const mySearch = new window.Mazemap.Search.SearchController({
      campusid: 111,
      rows: 10,
      withpois: true,
      withbuilding: false,
      withtype: false,
      withcampus: false,
      resultsFormat: 'geojson',
    })

    const initializeSearch = () => {
      if (searchInputRef.current && suggestionsRef.current) {
        const mySearchInput = new window.Mazemap.Search.SearchInput({
          container: document.getElementById('search-input-container'),
          input: searchInputRef.current,
          suggestions: suggestionsRef.current,
          searchController: mySearch,
        })

        mySearchInput.on('resultselected', function (e) {
          console.log('Search result selected:', e)
          // Handle the selected location here
        })

        searchInputInstanceRef.current = mySearchInput

        searchInputRef.current.addEventListener('input', () => {
          if (searchInputInstanceRef.current) {
            searchInputInstanceRef.current.trigger()
          }
        })
      } else {
        setTimeout(initializeSearch, 100)
      }
    }

    initializeSearch()

    return () => {
      map.remove()
    }
  }, [])

  return { searchInputRef, suggestionsRef }
}

function AnchorTemporaryDrawer() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    left: false,
  })

  const [openDialog, setOpenDialog] = useState(false)
  const { searchInputRef, suggestionsRef } = useMazeMap()

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setState({ ...state, [anchor]: open })
  }

  const handleCreateEvent = () => {
    setOpenDialog(true)
    setState({ ...state, left: false })
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const menuItems = [
    { text: "", icon: <CloseIcon />, action: toggleDrawer('left', false) },
    { text: "Create New Event", icon: <PlaceIcon />, action: handleCreateEvent },
    { text: "Edit Event", icon: <CreateIcon />, action: () => {} },
    { text: "Saved", icon: <TurnedInIcon />, action: () => {} },
    { text: "Event List", icon: <ListAltIcon />, action: () => {navigate('/eventList')} },
  ]

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300 }}
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
  )

  return (
    <div className="absolute top-auto left-auto z-10">
      <Button onClick={toggleDrawer('left', true)}>
        <MenuIcon className="text-black" />
      </Button>
      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
      </Drawer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{ borderRadius: '16px' }}
      >
        <DialogTitle style={{ backgroundColor: '#CFCFCF' }}>
          Create New Event
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#CFCFCF' }}>
          <div id="Event-Name-Container" style={{ paddingBottom: '2rem' }}>
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
                ref={searchInputRef}
                tabIndex={0}
                id="searchInput"
                className="search-input"
                autoComplete="off"
                type="text"
                name="search"
                placeholder="Location"
              />
            </form>
            <div ref={suggestionsRef} id="suggestions" className="search-suggestions default"></div>
          </div>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#CFCFCF' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCloseDialog}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default function MapPage() {
  return (
    <div className="flex h-screen">
      <AnchorTemporaryDrawer />
      <div className="relative flex-grow w-screen h-screen rounded-lg shadow-lg overflow-hidden">
        <div id="map" className="absolute inset-0" />
      </div>
    </div>
  )
}