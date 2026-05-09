"use client";

import React from 'react';
import { BrainCircuit, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const AIInsights = () => {
  return (
    <Card className="p-6 bg-white border-slate-200 overflow-hidden relative rounded-[2rem] shadow-sm">
      <div className="absolute -right-8 -top-8 opacity-[0.03]">
        <BrainCircuit size={160} className="text-primary" />
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Zap className="text-primary w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">AI Travel Insights</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Route Reliability Score</span>
              <span className="font-bold text-emerald-500">94%</span>
            </div>
            <Progress value={94} className="h-2 bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <TrendingUp className="w-3 h-3" /> Delay Prob.
              </div>
              <p className="text-xl font-black text-slate-900">12%</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <AlertCircle className="w-3 h-3" /> Alt. Routes
              </div>
              <p className="text-xl font-black text-slate-900">4 Found</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-sm leading-relaxed text-slate-600">
              <span className="font-bold text-primary">Smart Tip:</span> Booking the 08:30 train instead of the 09:00 increases connection reliability by 15% due to historical terminal congestion.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIInsights;