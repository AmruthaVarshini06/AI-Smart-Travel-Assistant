import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  source: string;
  destination: string;
};

const cityCoordinates: Record<string, [number, number]> = {
  Hyderabad: [17.385, 78.4867],
  Bangalore: [12.9716, 77.5946],
  Tirupati: [13.6288, 79.4192],
  Chennai: [13.0827, 80.2707],
  Mumbai: [19.076, 72.8777],
};

export default function RouteMap({
  source,
  destination,
}: Props) {
  const sourceCoords =
    cityCoordinates[source] || [17.385, 78.4867];

  const destCoords =
    cityCoordinates[destination] || [12.9716, 77.5946];

  return (
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
      />

      <Marker position={sourceCoords}>
        <Popup>{source}</Popup>
      </Marker>

      <Marker position={destCoords}>
        <Popup>{destination}</Popup>
      </Marker>
    </MapContainer>
  );
}