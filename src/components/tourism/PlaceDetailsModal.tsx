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
import { TouristPlace, CATEGORY_COLORS } from '@/lib/tourism-data';
import { 
  Star, Clock, Wallet, Calendar, MapPin, Navigation, 
  Plus, Check, Info, ShieldCheck, Sparkles, 
  Utensils, Hotel, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PlaceDetailsModalProps {
  place: TouristPlace | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
}

const PlaceDetailsModal = ({ place, isOpen, onClose, onToggleSelect, isSelected }: PlaceDetailsModalProps) => {
  const [activeImage, setActiveImage] = React.useState(0);
  
  if (!place) return null;

  // Mock gallery images
  const gallery = [
    place.image,
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] bg-white border-none rounded-[3rem] p-0 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        {/* Left Side: Immersive Gallery */}
        <div className="lg:w-1/2 h-[40vh] lg:h-auto relative shrink-0 bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeImage}
              src={gallery[activeImage]} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover" 
              alt={place.name} 
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Gallery Controls */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
            <div className="flex gap-2">
              {gallery.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    activeImage === i ? "w-8 bg-white" : "w-2 bg-white/40"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                onClick={() => setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                onClick={() => setActiveImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          <div className="absolute top-8 left-8">
            <Badge className={cn("mb-3 border-none text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest", CATEGORY_COLORS[place.category])}>
              {place.category}
            </Badge>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none">{place.name}</h2>
          </div>
        </div>

        {/* Right Side: Content & Details */}
        <div className="lg:w-1/2 flex flex-col overflow-hidden bg-white">
          <div className="p-8 lg:p-12 space-y-8 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-base font-black text-slate-900">{place.rating}</span>
                </div>
                <span className="text-sm text-slate-400 font-bold">({place.reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Destination</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900">About this place</h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                {place.description}
              </p>
            </div>

            {/* Logistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: 'Timings', value: place.timings },
                { icon: Wallet, label: 'Entry Fee', value: place.entryFee },
                { icon: Calendar, label: 'Best Time', value: place.bestTime },
                { icon: MapPin, label: 'Duration', value: place.duration }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-1">
                  <item.icon className="w-4 h-4 text-primary mb-1" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-xs font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            {/* AI Travel Tips */}
            <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Sparkles size={80} className="text-primary" />
              </div>
              <div className="relative z-10 space-y-3">
                <h4 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={16} /> AI Travel Tips
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-slate-600 flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Visit early morning to avoid the peak tourist crowds and get the best lighting for photos.
                  </li>
                  <li className="text-sm text-slate-600 flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Carry comfortable walking shoes as the terrain involves significant exploration on foot.
                  </li>
                </ul>
              </div>
            </div>

            {/* Nearby Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Nearby Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="bg-rose-50 p-3 rounded-xl">
                    <Utensils className="text-rose-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">8 Restaurants</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Top Rated Nearby</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <Hotel className="text-indigo-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">12 Hotels</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Within 2km Radius</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 lg:p-12 border-t border-slate-100 bg-white shrink-0 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold border-slate-200 gap-2 text-base">
              <Navigation size={20} /> Get Directions
            </Button>
            <Button 
              onClick={() => onToggleSelect(place.id)}
              className={cn(
                "flex-1 rounded-2xl h-14 font-black gap-2 shadow-xl transition-all text-base",
                isSelected ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" : "bg-primary hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {isSelected ? <Check size={20} /> : <Plus size={20} />}
              {isSelected ? 'Added to Trip' : 'Add to Trip'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceDetailsModal;