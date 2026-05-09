"use client";

import React from 'react';
import { TravelRoute, TransportMode } from '@/lib/mock-data';
import { Plane, Train, Bus, Car, ChevronRight, Clock, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RouteCardProps {
  route: TravelRoute;
  index: number;
  onViewDetails: (route: TravelRoute) => void;
}

const ModeIcon = ({ mode }: { mode: TransportMode }) => {
  switch (mode) {
    case 'flight': return <Plane className="w-5 h-5 text-blue-500" />;
    case 'train': return <Train className="w-5 h-5 text-indigo-600" />;
    case 'bus': return <Bus className="w-5 h-5 text-amber-500" />;
    case 'cab': return <Car className="w-5 h-5 text-emerald-600" />;
    default: return <ChevronRight className="w-5 h-5 text-slate-400" />;
  }
};

const RouteCard = ({ route, index, onViewDetails }: RouteCardProps) => {
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onViewDetails(route)}
      className="group relative bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {route.type === 'recommended' && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-5 py-2 rounded-bl-2xl uppercase tracking-widest z-10">
          Best Choice
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {route.segments.map((seg, i) => (
              <React.Fragment key={i}>
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl border transition-colors",
                  seg.mode === 'flight' ? "bg-blue-50 border-blue-100" :
                  seg.mode === 'train' ? "bg-indigo-50 border-indigo-100" :
                  seg.mode === 'cab' ? "bg-emerald-50 border-emerald-100" :
                  "bg-slate-50 border-slate-100"
                )}>
                  <ModeIcon mode={seg.mode} />
                </div>
                {i < route.segments.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reliability</p>
            <div className="flex items-center gap-1.5 justify-end">
              <ShieldCheck className={cn(
                "w-4 h-4",
                route.reliabilityScore > 90 ? "text-emerald-500" : "text-amber-500"
              )} />
              <span className="font-black text-slate-900">{Math.round(route.reliabilityScore)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Clock className="w-3 h-3" /> Total Time
            </div>
            <p className="text-2xl font-black text-slate-900">{formatDuration(route.totalDuration)}</p>
            <p className="text-xs text-slate-500 font-medium">Arrives at {route.segments[route.segments.length-1].arrivalTime}</p>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest justify-end">
              <Wallet className="w-3 h-3" /> Est. Cost
            </div>
            <p className="text-2xl font-black text-primary">₹{Math.round(route.totalCost).toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-bold">Save ₹{Math.round(route.totalCost * 0.15)} today</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i + index}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="pl-4 text-[10px] font-bold text-slate-400 uppercase flex items-center">
              +12 others booked
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-black text-sm group-hover:translate-x-1 transition-transform">
            View Details <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RouteCard;