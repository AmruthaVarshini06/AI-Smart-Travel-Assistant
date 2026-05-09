"use client";

import React from 'react';
import { TrendingUp, Clock, Calendar } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subValue, color }: any) => (
  <div className="glass-card p-5 rounded-[2rem] flex items-center gap-4 shadow-sm border-slate-200">
    <div className={`p-3 rounded-2xl bg-${color}/10`}>
      <Icon className={`w-5 h-5 text-${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-xl font-black text-slate-900 truncate">{value}</h4>
        <span className="text-[10px] text-slate-500 font-medium truncate">{subValue}</span>
      </div>
    </div>
  </div>
);

const DashboardHeader = () => {
  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium">Plan smarter. Travel better.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={Calendar} 
          label="Upcoming Trips" 
          value="3" 
          subValue="Active" 
          color="indigo-500" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Predicted Savings" 
          value="₹2,450" 
          subValue="This Month" 
          color="emerald-500" 
        />
        <StatCard 
          icon={Clock} 
          label="Time Saved" 
          value="6.3 hrs" 
          subValue="Efficiency" 
          color="blue-500" 
        />
      </div>
    </div>
  );
};

export default DashboardHeader;