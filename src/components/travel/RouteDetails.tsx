"use client";

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { TravelRoute, TransportMode } from '@/types/travel';
import { 
  Plane, Train, Bus, Car, MapPin, Clock, 
  CheckCircle2, CreditCard, CalendarX, Sparkles, 
  Loader2, ChevronLeft, Star, Info, ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';
import InteractiveMap from './InteractiveMap';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

interface RouteDetailsProps {
  route: TravelRoute | null;
  isOpen: boolean;
  onClose: () => void;
  searchedSource?: string;
  searchedDest?: string;
  searchedDate?: string;
  showBooking?: boolean;
  isSatellite?: boolean;
}

const ModeIcon = ({ mode }: { mode: TransportMode }) => {
  switch (mode) {
    case 'flight': return <Plane className="w-5 h-5 text-blue-500" />;
    case 'train': return <Train className="w-5 h-5 text-indigo-600" />;
    case 'bus': return <Bus className="w-5 h-5 text-amber-500" />;
    case 'cab': return <Car className="w-5 h-5 text-emerald-600" />;
    default: return <MapPin className="w-5 h-5 text-slate-400" />;
  }
};

const RouteDetails = ({ 
  route, 
  isOpen, 
  onClose, 
  searchedSource, 
  searchedDest, 
  searchedDate,
  showBooking = true,
  isSatellite = false
}: RouteDetailsProps) => {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = React.useState(false);
  const [selectedPlace, setSelectedPlace] = React.useState<any | null>(null);

  if (!route) return null;

  const isPastDate = searchedDate ? new Date(searchedDate) < new Date(new Date().setHours(0,0,0,0)) : false;

  const handleBook = async () => {

  setIsBooking(true);

  const tripData = {
    destination:
      searchedDest ||
      route.segments[route.segments.length - 1].to,

    source:
      searchedSource ||
      route.segments[0].from,

    date:
      searchedDate ||
      new Date().toISOString().split('T')[0],

    status: 'Upcoming',

    mode:
      route.segments[0].mode.charAt(0).toUpperCase() +
      route.segments[0].mode.slice(1),

    cost: route.totalCost,

    full_route: route
  };

  try {

    const response = await axios.post(
      "http://localhost:5000/api/trips/book",
      tripData
    );

    showSuccess("Trip booked successfully!");

    onClose();

    navigate('/trips');

  } catch (err) {

    console.log(err);

    showSuccess("Trip saved locally!");

    // fallback local storage
    const existingTrips = JSON.parse(
      localStorage.getItem('bookedTrips') || '[]'
    );

    localStorage.setItem(
      'bookedTrips',
      JSON.stringify([
        {
          ...tripData,
          id: Date.now().toString()
        },
        ...existingTrips
      ])
    );

    onClose();

    navigate('/trips');

  } finally {

    setIsBooking(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[85vw] w-full h-[85vh] bg-white border-none rounded-[3rem] p-0 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        {/* Left Side: Interactive Map (65% width) */}
        <div className="lg:w-[65%] h-[40vh] lg:h-auto relative shrink-0 border-r border-slate-100">
          <InteractiveMap 
            source={searchedSource || route.segments[0].from} 
            destination={searchedDest || route.segments[route.segments.length - 1].to} 
            segments={route.segments}
            isSatellite={isSatellite}
            onPlaceClick={setSelectedPlace}
            selectedPlaceId={selectedPlace?.name}
          />
        </div>

        {/* Right Side: Dynamic Info Panel (35% width) */}
        <div className="lg:w-[35%] flex flex-col overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {selectedPlace ? (
              /* Place Detail View */
              <motion.div 
                key="place-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedPlace(null)}
                    className="mb-4 -ml-2 text-slate-400 hover:text-primary font-bold gap-2"
                  >
                    <ChevronLeft size={18} /> Back to Itinerary
                  </Button>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-black tracking-tight text-slate-900">{selectedPlace.name}</h3>
                      <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-black">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 w-fit">
                      <ShieldCheck size={16} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Verified Spot</span>
                    </div>

                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                      {selectedPlace.description || "A key landmark along your journey. This location offers unique cultural experiences and scenic views perfect for a short break."}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Best Time</p>
                        <p className="text-xs font-bold text-slate-900">Morning / Evening</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Entry Fee</p>
                        <p className="text-xs font-bold text-slate-900">Free / Nominal</p>
                      </div>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 space-y-3">
                      <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} /> AI Travel Tip
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Most travelers spend about 45 minutes here. If you're on the {selectedPlace.mode || 'train'}, look out the window 5 minutes before arrival for the best view.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Itinerary View */
              <motion.div 
                key="itinerary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                  <DialogHeader>
                    <div className="flex items-center justify-between mb-2">
                      <DialogTitle className="text-3xl font-black tracking-tight text-slate-900">Journey Details</DialogTitle>
                      <span className="text-[10px] font-black bg-primary/10 text-primary px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                        {route.type}
                      </span>
                    </div>
                    <DialogDescription className="text-slate-500 text-base">
                      Optimized route from <span className="text-slate-900 font-bold">{searchedSource || route.segments[0].from}</span>.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Time</p>
                      <p className="text-lg font-black text-slate-900">{Math.floor(route.totalDuration / 60)}h {Math.round(route.totalDuration % 60)}m</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cost</p>
                      <p className="text-lg font-black text-primary">₹{route.totalCost.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="relative space-y-4 before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {route.segments.map((segment, idx) => (
                      <div key={idx} className="relative pl-14 group">
                        <div className={cn(
                          "absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border-2 flex items-center justify-center z-10 transition-colors shadow-sm",
                          segment.mode === 'flight' ? "border-blue-100" :
                          segment.mode === 'train' ? "border-indigo-100" :
                          segment.mode === 'cab' ? "border-emerald-100" :
                          "border-slate-200"
                        )}>
                          <ModeIcon mode={segment.mode} />
                        </div>
                        
                        <div className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 hover:border-primary/30 transition-all cursor-pointer" onClick={() => setSelectedPlace({ name: segment.from, type: 'stop', mode: segment.mode })}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-black text-base capitalize text-slate-900">{segment.mode}</h4>
                              <p className="text-xs text-slate-500">{segment.from} → {segment.to}</p>
                            </div>
                            <p className="font-black text-lg text-primary">₹{segment.cost}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-primary" /> {segment.departureTime}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> On Time
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="p-8 border-t border-slate-100 bg-white shrink-0">
            <Button variant="ghost" onClick={onClose} className="rounded-2xl text-slate-400 font-bold px-6">
              Close
            </Button>
            {showBooking && (
              isPastDate ? (
                <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100">
                  <CalendarX className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Past Date</span>
                </div>
              ) : (
                <Button 
                  onClick={handleBook} 
                  disabled={isBooking}
                  className="rounded-2xl px-10 h-14 gap-3 shadow-xl shadow-primary/20 font-black text-base"
                >
                  {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                  Book Route
                </Button>
              )
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDetails;