"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Train, Bus, ArrowRight, ShieldCheck, Clock, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoRoutes = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleRouteClick = () => {
    if (isLoggedIn) {
      navigate('/navigate');
    } else {
      navigate('/login');
    }
  };

  const demoRoutes = [
    {
      from: "Hyderabad",
      to: "Bangalore",
      mode: "flight",
      time: "1h 15m",
      cost: "₹3,200",
      reliability: "98%",
      color: "blue"
    },
    {
      from: "Mumbai",
      to: "Pune",
      mode: "train",
      time: "3h 10m",
      cost: "₹450",
      reliability: "94%",
      color: "indigo"
    },
    {
      from: "Delhi",
      to: "Jaipur",
      mode: "bus",
      time: "5h 30m",
      cost: "₹800",
      reliability: "91%",
      color: "amber"
    }
  ];

  return (
    <div className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900">Live Route Previews</h2>
          <p className="text-slate-500 font-medium">Real-time data from our neural engine showing the most efficient paths across India.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoRoutes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              onClick={handleRouteClick}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-${route.color}-50`}>
                  {route.mode === 'flight' ? <Plane className={`text-${route.color}-500`} /> : 
                   route.mode === 'train' ? <Train className={`text-${route.color}-500`} /> : 
                   <Bus className={`text-${route.color}-500`} />}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reliability</p>
                  <div className="flex items-center gap-1 justify-end text-emerald-500 font-bold">
                    <ShieldCheck size={14} /> {route.reliability}
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-black text-slate-900">{route.from}</h3>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="h-px flex-1 bg-slate-100" />
                  <ArrowRight size={14} />
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <h3 className="text-xl font-black text-slate-900">{route.to}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock size={12} /> Duration
                  </div>
                  <p className="font-bold text-slate-900">{route.time}</p>
                </div>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-1 justify-end text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Wallet size={12} /> Est. Cost
                  </div>
                  <p className="font-bold text-primary">{route.cost}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoRoutes;