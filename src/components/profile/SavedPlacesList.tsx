"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

const SavedPlacesList = () => {
  const navigate = useNavigate();
  const places = [
    { name: 'Manali', location: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=200&q=80' },
    { name: 'Kerala', location: "God's Own Country", image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=200&q=80' },
    { name: 'Varanasi', location: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <Card className="p-6 bg-white border-slate-100 rounded-[2rem] shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900">Saved Places</h3>
        <button 
          onClick={() => navigate('/explore')}
          className="text-sm font-bold text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {places.map((place, i) => (
          <div 
            key={i} 
            onClick={() => navigate('/explore')}
            className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-slate-900 truncate">{place.name}</h4>
              <p className="text-xs text-slate-400 font-medium truncate">{place.location}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                showSuccess(`${place.name} removed from saved places.`);
              }}
              className="text-primary hover:scale-110 transition-transform"
            >
              <Bookmark size={18} fill="currentColor" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SavedPlacesList;