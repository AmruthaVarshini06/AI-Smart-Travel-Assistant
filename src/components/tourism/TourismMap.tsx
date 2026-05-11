"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TouristPlace } from '@/lib/tourism-data';
import { renderToString } from 'react-dom/server';
import { cn } from '@/lib/utils';
import { Type, EyeOff } from 'lucide-react';

interface TourismMapProps {
  places: TouristPlace[];
  selectedPlaces: string[];
  visitedPlaces?: string[];
  skippedPlaces?: string[];
  onPlaceClick: (place: TouristPlace) => void;
  source?: string;
  destination?: string;
}

const MapController = ({ center, zoom, bounds }: { center: [number, number], zoom: number, bounds?: L.LatLngBoundsExpression }) => {
  const map = useMap();
  React.useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds, map]);
  return null;
};

const TourismMap = ({ places, selectedPlaces, visitedPlaces = [], skippedPlaces = [], onPlaceClick, source, destination }: TourismMapProps) => {
  const [showAllNames, setShowAllNames] = React.useState(false);
  const defaultCenter: [number, number] = [15.0, 78.0];
  
  const createCustomIcon = (place: TouristPlace) => {
    const isSelected = selectedPlaces.includes(place.id);
    const isVisited = visitedPlaces.includes(place.id);
    const isSkipped = skippedPlaces.includes(place.id);
    
    // Color Logic: Visited (Green) > Skipped (Red) > Added (Blue) > Default (Gray)
    const colorClass = isVisited ? "bg-emerald-500" : 
                       isSkipped ? "bg-red-500" : 
                       isSelected ? "bg-primary" : "bg-slate-400";
    
    const iconHtml = renderToString(
      <div className="relative flex flex-col items-center">
        <div className={cn(
          "w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg transition-all border-2 border-white relative z-20",
          colorClass,
          isSelected ? "ring-4 ring-primary/20 scale-110" : "hover:scale-110"
        )}>
          <div className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>

        {(showAllNames || isSelected) && (
          <div className={cn(
            "mt-1.5 px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border shadow-sm transition-all whitespace-nowrap z-10 pointer-events-none",
            isSelected ? "border-primary text-primary font-black text-[11px]" : "border-slate-200 text-slate-600 font-bold text-[9px]"
          )}>
            {place.name}
          </div>
        )}

        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white z-30 animate-pulse" />
        )}
      </div>
    );

    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon',
      iconSize: [100, 60],
      iconAnchor: [50, 18],
    });
  };

  const bounds = places.length > 0 
    ? L.latLngBounds(places.map(p => [p.lat, p.lng])) 
    : undefined;

  const routePath: [number, number][] = [
    [17.3850, 78.4867], [15.8285, 78.0330], [15.1023, 78.1130], [12.9716, 77.5946],
  ];

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-200 relative z-0">
      <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController center={defaultCenter} zoom={6} bounds={bounds} />
        <Polyline positions={routePath} pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.6, dashArray: '10, 10' }} />
        {places.map((place) => {
          const isSelected = selectedPlaces.includes(place.id);
          return (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lng]} 
              icon={createCustomIcon(place)}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{ click: () => onPlaceClick(place) }}
            >
              {!showAllNames && !isSelected && (
                <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                  <div className="px-2 py-1 font-bold text-xs text-slate-800">{place.name}</div>
                </Tooltip>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3">
        <button 
          onClick={() => setShowAllNames(!showAllNames)}
          className={cn(
            "p-3 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all flex items-center justify-center",
            showAllNames ? "bg-primary text-white border-primary shadow-primary/20" : "bg-white/90 text-slate-600 border-slate-200 hover:bg-white"
          )}
        >
          {showAllNames ? <Type size={20} /> : <EyeOff size={20} />}
        </button>
        <div className="bg-white/90 backdrop-blur-xl p-1 rounded-2xl shadow-2xl border border-slate-200 flex flex-col">
          <button className="p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 font-black text-xl">+</button>
          <div className="h-px bg-slate-100 mx-2" />
          <button className="p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 font-black text-xl">-</button>
        </div>
      </div>
    </div>
  );
};

export default TourismMap;