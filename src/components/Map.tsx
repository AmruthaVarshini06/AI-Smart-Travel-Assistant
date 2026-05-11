import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import * as L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import "leaflet-routing-machine";

type RoutingMachine = typeof L & {
  Routing: {
    control: (options: {
      waypoints: L.LatLngExpression[];
      routeWhileDragging: boolean;
      lineOptions: {
        styles: Array<{ color: string; weight: number }>;
      };
      createMarker: (i: number, wp: { latLng: L.LatLngExpression }) => L.Marker;
    }) => L.Control;
  };
};

function Routing() {
  const map = useMap();

  useEffect(() => {
    const routingControl = (L as unknown as RoutingMachine).Routing.control({
      waypoints: [
        L.latLng(17.385, 78.4867),
        L.latLng(12.9716, 77.5946),
      ],

      routeWhileDragging: false,

      lineOptions: {
        styles: [
          {
            color: "blue",
            weight: 5,
          },
        ],
      },

      createMarker: function (_i: number, wp: { latLng: L.LatLngExpression }) {
        return L.marker(wp.latLng);
      },
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map]);

  return null;
}

export default function Map() {
  return (
    <MapContainer
      center={[15.5, 78]}
      zoom={6}
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Routing />
    </MapContainer>
  );
}