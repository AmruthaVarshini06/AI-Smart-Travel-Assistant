"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { TouristPlace, TOURIST_PLACES } from '@/lib/tourism-data';
import { Badge } from '@/components/ui/badge';

interface PopularPlacesGridProps {
  onViewDetails: (place: TouristPlace) => void;
}

const PopularPlacesGrid = ({ onViewDetails }: PopularPlacesGridProps) => {
  // Filter for 'famous' or highly rated places
  const famousPlaces = TOURIST_PLACES.filter(p => p.rating >= 4.5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-2 rounded-xl">
            <Sparkles className="text-amber-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Trending Destinations</h2>
            <p className="text-xs text-slate-500 font-medium">Most visited spots along popular routes</p>
          </div>
        </div>
        <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {famousPlaces.map((place, idx) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
            onClick={() => onViewDetails(place)}
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={place.image} 
                alt={place.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white font-bold">
                  {place.category}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black text-white">{place.rating}</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">{place.name}</h3>
              </div>
            </div>
            
            <div className="p-5 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={14} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {place.locationType === 'source' ? 'Near Origin' : place.locationType === 'destination' ? 'At Destination' : 'On Route'}
                </span>
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularPlacesGrid;