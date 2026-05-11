"use client";

import React from 'react';
import { Search, MapPin, ArrowRightLeft, Mic, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface RoutePlannerProps {
  onSearch: (source: string, dest: string) => void;
  isLoading?: boolean;
}

const RoutePlanner = ({ onSearch, isLoading }: RoutePlannerProps) => {
  const [source, setSource] = React.useState('Hyderabad');
  const [dest, setDest] = React.useState('Bangalore');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(source, dest);
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-2xl p-3 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-4">
          <MapPin className="text-primary w-5 h-5 shrink-0" />
          <Input 
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border-none bg-transparent focus-visible:ring-0 font-bold text-slate-900 placeholder:text-slate-400"
            placeholder="Source City"
          />
        </div>
        
        <button 
          onClick={() => { setSource(dest); setDest(source); }}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
        >
          <ArrowRightLeft size={18} />
        </button>

        <div className="flex-1 flex items-center gap-2 px-4">
          <MapPin className="text-emerald-500 w-5 h-5 shrink-0" />
          <Input 
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="border-none bg-transparent focus-visible:ring-0 font-bold text-slate-900 placeholder:text-slate-400"
            placeholder="Destination"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400">
            <Mic size={20} />
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-2xl px-8 h-12 shadow-lg shadow-primary/20 font-black gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={18} />}
            Search Route
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoutePlanner;