"use client";

import React from 'react';
import { Destination } from '@/lib/explore-data';
import DestinationCard from './DestinationCard';
import { ChevronRight } from 'lucide-react';

interface HighlightSectionProps {
  title: string;
  destinations: Destination[];
  onExplore: (dest: Destination) => void;
}

const HighlightSection = ({ title, destinations, onExplore }: HighlightSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2>
        <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
          View All <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-8 px-2 custom-scrollbar snap-x">
        {destinations.map((dest) => (
          <div key={dest.id} className="snap-start">
            <DestinationCard 
              destination={dest} 
              onExplore={onExplore} 
              variant="highlight" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightSection;