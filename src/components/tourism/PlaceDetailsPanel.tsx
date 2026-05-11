"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Clock, Wallet, Calendar, MapPin, Navigation, 
  Plus, Check, Info, Trash2, CheckCircle2, XCircle,
  Users, CloudSun, Sparkles, ArrowRight
} from 'lucide-react';
import { TouristPlace, CATEGORY_COLORS } from '@/lib/tourism-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';

interface PlaceDetailsPanelProps {
  place: TouristPlace | null;
  onToggleSelect: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onToggleSkipped: (id: string) => void;
  isSelected: boolean;
  isVisited: boolean;
  isSkipped: boolean;
  onSaveTrip: () => void;
}

const PlaceDetailsPanel = ({ 
  place, 
  onToggleSelect, 
  onToggleVisited, 
  onToggleSkipped, 
  isSelected, 
  isVisited, 
  isSkipped, 
  onSaveTrip 
}: PlaceDetailsPanelProps) => {
  if (!place) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 bg-white">
        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
          <MapPin className="w-10 h-10 text-primary/20" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">Select a Destination</h3>
          <p className="text-sm text-slate-500">Click on any marker on the map to view full details.</p>
        </div>
      </div>
    );
  }

  const mockDistance = (Math.random() * 15 + 2).toFixed(1);

  const handleNavigate = () => {
    showSuccess(`Starting navigation to ${place.name}...`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col bg-white overflow-hidden"
    >
      <div className="h-48 relative shrink-0">
        <img src={place.image} className="w-full h-full object-cover" alt={place.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <Badge className={cn("mb-2 border-none text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg", CATEGORY_COLORS[place.category])}>
            {place.category}
          </Badge>
          <h2 className="text-3xl font-black text-white tracking-tighter leading-none">{place.name}</h2>
          <p className="text-[10px] font-bold text-white/70 mt-1 flex items-center gap-1">
            <MapPin size={10} /> {mockDistance} km from you
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-base font-black text-slate-900">{place.rating}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={isVisited ? "default" : "outline"}
              onClick={() => onToggleVisited(place.id)}
              className={cn("rounded-xl h-9 gap-2 text-[9px] font-black uppercase", isVisited && "bg-emerald-500 hover:bg-emerald-600 border-none")}
            >
              <CheckCircle2 size={14} /> {isVisited ? 'Visited' : 'Mark Visited'}
            </Button>
            <Button 
              size="sm" 
              variant={isSkipped ? "destructive" : "outline"}
              onClick={() => onToggleSkipped(place.id)}
              className={cn("rounded-xl h-9 gap-2 text-[9px] font-black uppercase", isSkipped && "bg-red-500 hover:bg-red-600 border-none")}
            >
              <XCircle size={14} /> {isSkipped ? 'Skipped' : 'Skip'}
            </Button>
          </div>
        </div>

        {/* Logistics Grid - Fixed 4-column layout with equal sizes */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Clock, label: 'Timings', value: place.timings },
            { icon: Wallet, label: 'Entry Fee', value: place.entryFee },
            { icon: Calendar, label: 'Best Time', value: place.bestTime },
            { icon: MapPin, label: 'Duration', value: place.duration }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-1 min-h-[80px]">
              <item.icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</p>
              <p className="text-[9px] font-bold text-slate-900 leading-tight line-clamp-2 w-full">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 p-5 rounded-[2rem] border border-primary/10 space-y-2">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} /> AI Travel Tip
          </h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {place.description.slice(0, 120)}...
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {isSelected ? (
            <Button 
              onClick={() => onToggleSelect(place.id)}
              variant="destructive"
              className="h-12 rounded-2xl font-black gap-2 shadow-lg shadow-red-100"
            >
              <Trash2 size={18} /> Remove from Trip
            </Button>
          ) : (
            <Button 
              onClick={() => onToggleSelect(place.id)}
              className="h-12 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20"
            >
              <Plus size={18} /> Add to Trip
            </Button>
          )}
          <Button 
            onClick={handleNavigate}
            variant="outline" 
            className="h-12 rounded-2xl font-bold border-slate-200 gap-2"
          >
            <Navigation size={18} className="text-primary" /> Get Directions
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceDetailsPanel;