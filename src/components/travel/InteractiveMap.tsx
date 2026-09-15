"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import { RouteSegment } from "@/types/travel";
import "leaflet/dist/leaflet.css";

interface MapPlace {
  name: string;
  type?: string;
  mode?: string;
  description?: string;
}

interface InteractiveMapProps {
  source?: string;
  destination?: string;
  segments: RouteSegment[];
  isSatellite?: boolean;

  onPlaceClick?: (place: MapPlace) => void;
  selectedPlaceId?: string;
}

const colors: Record<string, string> = {
  flight: "#2563eb",
  train: "#6366f1",
  bus: "#f97316",
  cab: "#16a34a",
};

function FitBounds({
  positions,
}: {
  positions: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [50, 50] });
    }
  }, [map, positions]);

  return null;
}

const InteractiveMap = ({
  source,
  destination,
  segments,
  isSatellite,
  onPlaceClick,
  selectedPlaceId,
}: InteractiveMapProps) => {
  const [coordinates, setCoordinates] = useState<
    Record<string, [number, number]>
  >({});

  const [loading, setLoading] = useState(true);

  const getCoordinates = async (
    place: string
  ): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?countrycodes=in&q=${encodeURIComponent(
          `${place}, India`
        )}&format=jsonv2&limit=1`
      );

      const data = await response.json();

      return data.length
        ? [Number(data[0].lat), Number(data[0].lon)]
        : null;

    } catch (error) {
      console.error("Coordinate error:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadCoordinates = async () => {
      setLoading(true);

      const places = new Set<string>();

      if (source) places.add(source);
      if (destination) places.add(destination);

      segments.forEach(({ from, to }) => {
        if (from) places.add(from);
        if (to) places.add(to);
      });

      const results = await Promise.all(
        [...places].map(async (place) => ({
          place,
          coords: await getCoordinates(place),
        }))
      );

      const coords: Record<string, [number, number]> = {};

      results.forEach(({ place, coords: location }) => {
        if (location) coords[place] = location;
      });

      setCoordinates(coords);
      setLoading(false);
    };

    loadCoordinates();
  }, [source, destination, segments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-slate-100 rounded-[2rem]">
        Loading route map...
      </div>
    );
  }

  const sourceCoords = source ? coordinates[source] : undefined;
  const destinationCoords = destination
    ? coordinates[destination]
    : undefined;

  const positions = segments.flatMap((segment) => [
    coordinates[segment.from],
    coordinates[segment.to],
  ]).filter(Boolean) as [number, number][];

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden">
      <MapContainer
        center={sourceCoords || [20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={
            isSatellite
              ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {sourceCoords && (
          <Marker position={sourceCoords}>
            <Popup>
              <strong>Source:</strong> {source}
            </Popup>
          </Marker>
        )}

        {destinationCoords && (
          <Marker position={destinationCoords}>
            <Popup>
              <strong>Destination:</strong> {destination}
            </Popup>
          </Marker>
        )}

        {segments.map((segment, index) => {
          const from = coordinates[segment.from];
          const to = coordinates[segment.to];

          if (!from || !to) return null;

          const mode = String(segment.mode).toLowerCase();

          return (
            <React.Fragment key={index}>
              <Polyline
                positions={[from, to]}
                pathOptions={{
                  color: colors[mode] || "#64748b",
                  weight: 6,
                  opacity: 0.85,
                }}
              />

              {index > 0 && (
  <Marker
    position={from}
    eventHandlers={{
      click: () => {
        onPlaceClick?.({
          name: segment.from,
          type: "stop",
          mode,
        });
      },
    }}
  >
    <Popup>
      <strong>{segment.from}</strong>
      <br />
      Mode: {mode}
    </Popup>
  </Marker>
)}
            </React.Fragment>
          );
        })}

        {positions.length >= 2 && (
          <FitBounds positions={positions} />
        )}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-2xl shadow-lg border border-slate-200">
        <h4 className="font-bold text-sm mb-3">
          Transportation Modes
        </h4>

        {[
          ["bg-blue-500", "Flight"],
          ["bg-indigo-500", "Train"],
          ["bg-orange-500", "Bus"],
          ["bg-green-500", "Cab"],
        ].map(([color, name]) => (
          <div
            key={name}
            className="flex items-center gap-2 text-xs mb-2"
          >
            <div className={`w-4 h-1 ${color} rounded-full`} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveMap;