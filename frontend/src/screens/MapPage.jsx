import { useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import PlaceIcon from "@mui/icons-material/Place";
import CreateIcon from "@mui/icons-material/Create";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

function useMazeMap() {
	const mapOptions = {
		container: "map",
		campuses: 111,
		center: { lng: 151.231232432, lat: -33.917529664 },
		zoom: 16.2,
		zLevel: 1,
	};

	const map = new window.Mazemap.Map(mapOptions);
	map.addControl(new window.Mazemap.mapboxgl.NavigationControl());
}

function AnchorTemporaryDrawer() {
	const navigate = useNavigate();

	const [state, setState] = React.useState({
		left: false,
	});

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setState({ ...state, [anchor]: open });
	};

	const menuItems = [
		{ text: "", icon: <CloseIcon />, action: "" },
		{ text: "Create New Event", icon: <PlaceIcon />, action: "" },
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
						<ListItemButton onClick={() => navigate(action)}>
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
		<div style={{ position: "absolute", top: 36, left: 5, zIndex: 10 }}>
			<Button onClick={toggleDrawer("left", true)}>
				<MenuIcon
					style={{color: "black" }}
				/>
			</Button>
			<Drawer
				anchor="left"
				open={state.left}
				onClose={toggleDrawer("left", false)}
			>
				{list("left")}
			</Drawer>
		</div>
	);
}

export default function MapPage() {
	useEffect(() => {
		useMazeMap();
	}, []);

	return (
		<div className="flex h-screen">
			<AnchorTemporaryDrawer />
			<div className="relative flex-grow w-screen h-screen rounded-lg shadow-lg overflow-hidden">
				<div id="map" className="absolute inset-0" />
			</div>
		</div>
	);
}
