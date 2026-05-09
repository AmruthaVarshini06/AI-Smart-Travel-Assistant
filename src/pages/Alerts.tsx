"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Alerts = () => {
  const alerts = [
    { id: 1, type: 'warning', title: 'Weather Alert: Bangalore', desc: 'Heavy rain expected tomorrow. Expect 15-20 min delays on rail routes.', time: '2h ago', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 2, type: 'info', title: 'Price Drop: Mumbai Flight', desc: 'Prices for your tracked route have dropped by 12%. Book now to save ₹800.', time: '5h ago', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, type: 'success', title: 'Booking Confirmed', desc: 'Your trip to Hyderabad has been successfully confirmed. Tickets sent to email.', time: '1d ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Travel Alerts</h1>
          <p className="text-slate-500 text-sm">Stay updated with real-time travel intelligence.</p>
        </div>

        <div className="max-w-3xl space-y-4">
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 border-slate-200 shadow-sm flex gap-4 items-start hover:border-primary/20 transition-all cursor-pointer rounded-3xl">
                <div className={`p-3 rounded-2xl ${alert.bg}`}>
                  <alert.icon className={`w-6 h-6 ${alert.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">{alert.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{alert.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Alerts;