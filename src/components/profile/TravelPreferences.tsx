"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Settings, Star, Plane, Armchair, Wallet, Utensils, Briefcase } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const TravelPreferences = () => {
  const preferences = [
    { icon: Star, label: 'Travel Style', value: 'Balanced', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Plane, label: 'Preferred Modes', value: 'Train, Flight, Metro', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Armchair, label: 'Seat Preference', value: 'Window', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Wallet, label: 'Budget Range', value: '₹ 1000 - ₹ 5000', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Utensils, label: 'Meal Preference', value: 'Veg', color: 'text-slate-500', bg: 'bg-slate-50' },
    { icon: Briefcase, label: 'Preferred Class', value: 'Economy', color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <Card className="p-6 bg-white border-slate-100 rounded-[2rem] shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900">Travel Preferences</h3>
        <button 
          onClick={() => showSuccess("Opening preference settings...")}
          className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {preferences.map((pref, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors" onClick={() => showSuccess(`Updating ${pref.label}...`)}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${pref.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <pref.icon className={`w-4 h-4 ${pref.color}`} />
              </div>
              <span className="text-sm font-bold text-slate-500">{pref.label}</span>
            </div>
            <span className="text-sm font-black text-slate-900">{pref.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TravelPreferences;