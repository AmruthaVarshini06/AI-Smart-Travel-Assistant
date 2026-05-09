"use client";

import React from 'react';
import { CloudRain, Wind, Droplets, TrendingUp, AlertCircle, Leaf } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { PRICE_TRENDS, DELAY_DATA } from '@/lib/mock-data';

export const WeatherWidget = () => (
  <div className="glass-card p-6 rounded-[2rem] space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-400/10 p-2 rounded-xl">
          <CloudRain className="text-blue-400 w-5 h-5" />
        </div>
        <h3 className="font-bold">Weather Forecast</h3>
      </div>
      <span className="text-[10px] text-slate-400 font-bold uppercase">10 May 2025</span>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <p className="text-4xl font-black">24°C</p>
        <p className="text-sm font-bold text-slate-300">Light Rain</p>
        <p className="text-xs text-slate-500">Feels like 23°C</p>
      </div>
      <CloudRain className="w-16 h-16 text-blue-400/40" />
    </div>

    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#2d2f45]">
      <div className="text-center">
        <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
        <p className="text-[10px] text-slate-500 font-bold uppercase">Humidity</p>
        <p className="text-sm font-bold">78%</p>
      </div>
      <div className="text-center">
        <Wind className="w-4 h-4 text-slate-400 mx-auto mb-1" />
        <p className="text-[10px] text-slate-500 font-bold uppercase">Wind</p>
        <p className="text-sm font-bold">12 km/h</p>
      </div>
      <div className="text-center">
        <CloudRain className="w-4 h-4 text-blue-400 mx-auto mb-1" />
        <p className="text-[10px] text-slate-500 font-bold uppercase">Precip.</p>
        <p className="text-sm font-bold">60%</p>
      </div>
    </div>
  </div>
);

export const PricePrediction = () => (
  <div className="glass-card p-6 rounded-[2rem] space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-400/10 p-2 rounded-xl">
          <TrendingUp className="text-emerald-400 w-5 h-5" />
        </div>
        <h3 className="font-bold">Price Prediction</h3>
      </div>
    </div>

    <div>
      <p className="text-sm text-slate-400">Prices likely to <span className="text-emerald-400 font-bold">increase 12%</span> in next 3 days</p>
    </div>

    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={PRICE_TRENDS}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const CO2Comparison = () => (
  <div className="glass-card p-6 rounded-[2rem] space-y-6">
    <div className="flex items-center gap-2">
      <div className="bg-green-400/10 p-2 rounded-xl">
        <Leaf className="text-green-400 w-5 h-5" />
      </div>
      <h3 className="font-bold">CO₂ Comparison</h3>
    </div>

    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
          <span>Your Trip</span>
          <span>2.4 kg</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 w-[20%]" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
          <span>By Car</span>
          <span>12.6 kg</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 w-[60%]" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
          <span>By Flight</span>
          <span>87.3 kg</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-red-400 w-[90%]" />
        </div>
      </div>
    </div>

    <div className="bg-green-400/10 p-3 rounded-xl border border-green-400/20">
      <p className="text-xs text-green-400 font-bold text-center">CO₂ Saved: 10.2 kg</p>
    </div>
  </div>
);