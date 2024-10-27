import { useEffect } from "react"

function useMazeMap() {

  const mapOptions = {
    container: 'map',
    campuses: 111,
    center: {lng: 151.231232432, lat:  -33.917529664 },
    zoom: 16.2,
    zLevel: 1,
  }

  const map = new window.Mazemap.Map(mapOptions)
  map.addControl(new window.Mazemap.mapboxgl.NavigationControl())

}

export default function MapPage() {
  useEffect (() => {
    useMazeMap()
  }, [])
  return (
    <div className="flex h-screen">
      <div className="relative flex-grow w-screen h-screen rounded-lg shadow-lg overflow-hidden">
        <div id="map" className="absolute inset-0" />
      </div>
    </div>
  )
}