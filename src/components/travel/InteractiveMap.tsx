"use client";

import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface InteractiveMapProps {
  source?: string;
  destination?: string;
  isSatellite?: boolean;
}

function Routing({
  sourceCoords,
  destinationCoords,
}: {
  sourceCoords: [number, number];
  destinationCoords: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl: any = (L.Routing.control as any)({
      waypoints: [
        L.latLng(sourceCoords[0], sourceCoords[1]),
        L.latLng(destinationCoords[0], destinationCoords[1]),
      ],

      routeWhileDragging: false,

      lineOptions: {
        styles: [
          {
            color: "#2563eb",
            weight: 6,
          },
        ],
      },

      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    return () => {
      try {
        if (routingControl) {
          map.removeControl(routingControl);
        }
      } catch (error) {
        console.log("Routing cleanup skipped");
      }
    };
  }, [map, sourceCoords, destinationCoords]);

  return null;
}

const InteractiveMap = ({
  source,
  destination,
  isSatellite,
}: InteractiveMapProps) => {
  const [sourceCoords, setSourceCoords] = useState<
    [number, number] | null
  >(null);

  const [destinationCoords, setDestinationCoords] = useState<
    [number, number] | null
  >(null);

  async function getCoordinates(place: string) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?countrycodes=in&q=${encodeURIComponent(
          place
        )}&format=jsonv2`
      );

      const data = await response.json();

      console.log("ROUTE DATA:", data);

      if (!data.length) return null;

      return [
        Number(data[0].lat),
        Number(data[0].lon),
      ] as [number, number];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    async function fetchCoordinates() {
      if (!source || !destination) return;

      console.log("SOURCE:", source);
      console.log("DEST:", destination);

      const src = await getCoordinates(`${source}, India`);
      const dest = await getCoordinates(`${destination}, India`);

      console.log("SRC:", src);
      console.log("DEST:", dest);

      if (src) setSourceCoords(src);
      if (dest) setDestinationCoords(dest);
    }

    fetchCoordinates();
  }, [source, destination]);

  if (!sourceCoords || !destinationCoords) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-100 rounded-[2rem] text-black">
        Unable to load map coordinates
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100%] min-h-[400px] rounded-[2rem] overflow-hidden">
      <MapContainer
        center={sourceCoords}
        zoom={5}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          url={
            isSatellite
              ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={sourceCoords}>
          <Popup>
            <strong>Source:</strong> {source}
          </Popup>
        </Marker>

        <Marker position={destinationCoords}>
          <Popup>
            <strong>Destination:</strong> {destination}
          </Popup>
        </Marker>

        <Routing
          sourceCoords={sourceCoords}
          destinationCoords={destinationCoords}
        />
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-2xl shadow-lg border border-slate-200">
        <h4 className="font-bold text-sm mb-3">
          Transportation Modes
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded-full" />
            <span>Flight</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-indigo-500 rounded-full" />
            <span>Train</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500 rounded-full" />
            <span>Bus</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500 rounded-full" />
            <span>Cab</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;