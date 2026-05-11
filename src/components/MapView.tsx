import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";

import polyline from "@mapbox/polyline";

type Coordinates = {
  lat: number;
  lon: number;
};

type LatLngArray = [number, number];

export default function MapView() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceCoords, setSourceCoords] = useState<Coordinates | null>(null);
  const [destCoords, setDestCoords] = useState<Coordinates | null>(null);

  const [route, setRoute] = useState<LatLngArray[]>([]);

  async function getCoordinates(place: string) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${place}&format=jsonv2`
    );

    const data = await response.json();

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }

  async function findRoute() {
    const start = await getCoordinates(source);
    const end = await getCoordinates(destination);

    setSourceCoords(start);
    setDestCoords(end);

    const apiKey = import.meta.env.VITE_ORS_API_KEY;

    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lon},${start.lat}&end=${end.lon},${end.lat}`
    );

    const data = await response.json();

    const encoded = data.routes[0].geometry;

    const decoded = polyline.decode(encoded) as LatLngArray[];

    setRoute(decoded);
  }

  return (
    <div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <button onClick={findRoute}>
          Find Route
        </button>
      </div>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{
          height: "90vh",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sourceCoords && (
          <Marker position={[sourceCoords.lat, sourceCoords.lon]}>
            <Popup>Source</Popup>
          </Marker>
        )}

        {destCoords && (
          <Marker position={[destCoords.lat, destCoords.lon]}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline positions={route} />
        )}
      </MapContainer>
    </div>
  );
}