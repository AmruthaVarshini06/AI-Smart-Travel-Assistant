"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Train, Bus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentTrips = () => {
  const navigate = useNavigate();
  const trips = [
    {
      id: 1,
      from: 'Mumbai',
      to: 'Delhi',
      date: '15 May 2024',
      travelers: 2,
      cost: '₹ 3,245',
      status: 'Completed',
      modes: [Train, Plane, Bus],
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      from: 'Jaipur',
      to: 'Udaipur',
      date: '28 Apr 2024',
      travelers: 1,
      cost: '₹ 1,870',
      status: 'Completed',
      modes: [Train, Bus],
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      from: 'Bangalore',
      to: 'Goa',
      date: '10 Apr 2024',
      travelers: 2,
      cost: '₹ 2,450',
      status: 'Completed',
      modes: [Train, Plane, Bus],
      image: 'https://images.unsplash.com/photo-1512789172734-4b9809a46f6b?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <Card className="p-8 bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900">Recent Trips</h3>
        <button 
          onClick={() => navigate('/trips')}
          className="text-sm font-bold text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div 
            key={trip.id} 
            onClick={() => navigate('/trips')}
            className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl border border-slate-50 hover:border-primary/20 transition-all group cursor-pointer"
          >
            <div className="w-full sm:w-24 h-24 rounded-2xl overflow-hidden shrink-0">
              <img src={trip.image} alt={trip.to} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            </div>
            
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4 className="text-lg font-black text-slate-900">{trip.from} → {trip.to}</h4>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>{trip.date}</span>
                <span>•</span>
                <span>{trip.travelers} Travelers</span>
              </div>
              <div className="flex justify-center sm:justify-start gap-2">
                {trip.modes.map((Mode, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mode size={14} />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center sm:text-right space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Cost</p>
              <p className="text-xl font-black text-emerald-500">{trip.cost}</p>
              <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 py-1 text-[10px] font-black uppercase">
                {trip.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentTrips;