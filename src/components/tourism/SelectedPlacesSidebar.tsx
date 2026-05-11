"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Sparkles, Map, Clock, Wallet, ChevronRight, Star } from 'lucide-react';
import { TouristPlace } from '@/lib/tourism-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SelectedPlacesSidebarProps {
  selectedPlaces: TouristPlace[];
  onRemove: (id: string) => void;
  onGenerateItinerary: () => void;
  isGenerating?: boolean;
}

const SelectedPlacesSidebar = ({ selectedPlaces, onRemove, onGenerateItinerary, isGenerating }: SelectedPlacesSidebarProps) => {
  const totalCost = selectedPlaces.reduce((acc, p) => {
    const fee = parseInt(p.entryFee.replace(/[^0-9]/g, '')) || 0;
    return acc + fee;
  }, 0);

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-xl border-l border-slate-200 w-full">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Map className="text-primary w-5 h-5" /> Trip Summary
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">Your personalized tourism route</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Spots ({selectedPlaces.length})</span>
          </div>
          
          <AnimatePresence mode="popLayout">
            {selectedPlaces.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[2rem]"
              >
                <p className="text-sm text-slate-400 font-medium">Select attractions from the map to start planning</p>
              </motion.div>
            ) : (
              selectedPlaces.map((place) => (
                <motion.div
                  key={place.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary/30 transition-all"
                >
                  <div className="flex gap-3">
                    <img src={place.image} className="w-16 h-16 rounded-xl object-cover" alt={place.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{place.name}</h4>
                        <button onClick={() => onRemove(place.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-slate-600">{place.rating}</span>
                        <span className="text-[10px] text-slate-400">• {place.category}</span>
                      </div>
                      <p className="text-[10px] text-primary font-bold mt-1">{place.entryFee}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {selectedPlaces.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  <Wallet className="w-3 h-3" /> Est. Fees
                </div>
                <p className="text-lg font-black text-slate-900">₹{totalCost}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  <Clock className="w-3 h-3" /> Visit Time
                </div>
                <p className="text-lg font-black text-slate-900">{selectedPlaces.length * 2}h</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <Button 
          disabled={selectedPlaces.length === 0 || isGenerating}
          onClick={onGenerateItinerary}
          className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-base gap-3"
        >
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Sparkles size={20} />
            </motion.div>
          ) : <Sparkles size={20} />}
          Generate AI Itinerary
        </Button>
      </div>
    </div>
  );
};

export default SelectedPlacesSidebar;