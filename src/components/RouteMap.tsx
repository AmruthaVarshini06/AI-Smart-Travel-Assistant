import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

type Segment = {
  mode: string;
  from: string;
  to: string;
  duration?: number;
  cost?: number;
};

type Props = {
  source: string;
  destination: string;
  segments?: Segment[];
};

type Coordinates = [number, number];

const cityCoordinates: Record<string, Coordinates> = {
  Hyderabad: [17.385, 78.4867],
  Bangalore: [12.9716, 77.5946],
  Bengaluru: [12.9716, 77.5946],

  Tirupati: [13.6288, 79.4192],
  Chennai: [13.0827, 80.2707],

  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],

  Vijayawada: [16.5062, 80.648],
  Visakhapatnam: [17.6868, 83.2185],

  Kolkata: [22.5726, 88.3639],
  Pune: [18.5204, 73.8567],

  Goa: [15.2993, 74.124],
  Kochi: [9.9312, 76.2673],

  Ahmedabad: [23.0225, 72.5714],
  Jaipur: [26.9124, 75.7873],
};

const getModeColor = (mode: string) => {
  const normalizedMode = mode.toLowerCase();

  if (normalizedMode.includes("bus")) {
    return "#eab308";
  }

  if (normalizedMode.includes("train")) {
    return "#9333ea";
  }

  if (normalizedMode.includes("flight")) {
    return "#2563eb";
  }

  if (normalizedMode.includes("cab")) {
    return "#16a34a";
  }

  return "#64748b";
};

const getModeLabel = (mode: string) => {
  const normalizedMode = mode.toLowerCase();

  if (normalizedMode.includes("bus")) {
    return "🚌 Bus";
  }

  if (normalizedMode.includes("train")) {
    return "🚆 Train";
  }

  if (normalizedMode.includes("flight")) {
    return "✈️ Flight";
  }

  if (normalizedMode.includes("cab")) {
    return "🚕 Cab";
  }

  return mode;
};

export default function RouteMap({
  source,
  destination,
  segments = [],
}: Props) {

  const [coordinates, setCoordinates] =
    useState<Record<string, Coordinates>>(
      cityCoordinates
    );

  const getCoordinates = async (
    city: string
  ): Promise<Coordinates | null> => {

    if (coordinates[city]) {
      return coordinates[city];
    }

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          city
        )}`
      );

      const data = await response.json();

      if (!data || data.length === 0) {
        return null;
      }

      const coords: Coordinates = [
        parseFloat(data[0].lat),
        parseFloat(data[0].lon),
      ];

      setCoordinates((previous) => ({
        ...previous,
        [city]: coords,
      }));

      return coords;

    } catch (error) {

      console.error(
        "Error finding coordinates for:",
        city,
        error
      );

      return null;
    }
  };


  useEffect(() => {

    const loadMissingCities = async () => {

      const cities = new Set<string>();

      cities.add(source);
      cities.add(destination);

      segments.forEach((segment) => {
        cities.add(segment.from);
        cities.add(segment.to);
      });

      for (const city of cities) {

        if (!coordinates[city]) {
          await getCoordinates(city);
        }

      }

    };

    loadMissingCities();

  }, [source, destination, segments]);


  const sourceCoords =
    coordinates[source] ||
    cityCoordinates.Hyderabad;

  return (

    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >

      <MapContainer
        center={sourceCoords}
        zoom={6}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "20px",
        }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />


        {/* SOURCE MARKER */}

        {coordinates[source] && (

          <Marker
            position={coordinates[source]}
          >

            <Popup>
              📍 Source: {source}
            </Popup>

          </Marker>

        )}


        {/* DESTINATION MARKER */}

        {coordinates[destination] && (

          <Marker
            position={coordinates[destination]}
          >

            <Popup>
              🏁 Destination: {destination}
            </Popup>

          </Marker>

        )}


        {/* COMBINATION ROUTE SEGMENTS */}

        {segments.map(
          (segment, index) => {

            const fromCoords =
              coordinates[segment.from];

            const toCoords =
              coordinates[segment.to];

            if (
              !fromCoords ||
              !toCoords
            ) {
              return null;
            }

            return (

              <Polyline
                key={`${segment.from}-${segment.to}-${index}`}

                positions={[
                  fromCoords,
                  toCoords,
                ]}

                pathOptions={{
                  color:
                    getModeColor(
                      segment.mode
                    ),

                  weight: 6,

                  opacity: 0.85,
                }}
              >

                <Popup>

                  <div>

                    <strong>
                      {getModeLabel(
                        segment.mode
                      )}
                    </strong>

                    <br />

                    {segment.from}

                    {" → "}

                    {segment.to}

                  </div>

                </Popup>

              </Polyline>

            );

          }
        )}


        {/* DIRECT ROUTE FALLBACK */}

        {segments.length === 0 &&
          coordinates[source] &&
          coordinates[destination] && (

            <Polyline
              positions={[
                coordinates[source],
                coordinates[destination],
              ]}

              pathOptions={{
                color: "#2563eb",
                weight: 6,
                opacity: 0.85,
              }}
            />

          )}

      </MapContainer>


      {/* MAP LEGEND */}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          background: "white",
          padding: "12px",
          borderRadius: "12px",
          zIndex: 1000,
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)",
          fontSize: "13px",
        }}
      >

        <div>
          🟡 Bus
        </div>

        <div>
          🟣 Train
        </div>

        <div>
          🔵 Flight
        </div>

        <div>
          🟢 Cab
        </div>

      </div>

    </div>

  );
}