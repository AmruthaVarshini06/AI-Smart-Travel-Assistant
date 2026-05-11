"use client";

import React from 'react';
import { Map, Navigation, Wallet, Clock, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

interface TripSummaryProps {
  selectedCount: number;
  distance: number;
  duration: string;
  budget: number;
  aiScore: number;
  onComplete?: () => void;
}

const TripSummary = ({ selectedCount, distance, duration, budget, aiScore, onComplete }: TripSummaryProps) => {
  const navigate = useNavigate();

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      showSuccess("Starting your optimized journey!");
      navigate('/trips');
    }
  };

  return (
    <div className="p-5 bg-white space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <Map className="text-primary w-3.5 h-3.5" /> Trip Summary
        </h3>
        <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">AI Score: {aiScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <Navigation className="w-3 h-3" /> Distance
          </div>
          <p className="text-base font-black text-slate-900">{distance} km</p>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <Wallet className="w-3 h-3" /> Est. Budget
          </div>
          <p className="text-base font-black text-primary">₹{budget.toLocaleString()}</p>
        </div>
      </div>

      <Button 
        onClick={handleComplete}
        className="w-full h-10 rounded-xl font-black text-xs gap-2 shadow-lg shadow-primary/10"
      >
        <Play size={14} fill="currentColor" /> Start Full Journey
      </Button>
    </div>
  );
};

export default TripSummary;