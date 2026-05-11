"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TourismSection = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleExploreClick = () => {
    if (isLoggedIn) {
      navigate('/explore');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
              <Compass className="text-emerald-500 w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                Neural Exploration
              </span>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                Tourism <span className="text-emerald-500">Exploration</span> Along Your Path.
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Our AI doesn't just find the fastest route; it finds the most beautiful one. Explore hidden waterfalls, ancient temples, and local culinary secrets that traditional maps miss.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Map, title: "Smart Stops", desc: "Curated landmarks based on your interests." },
                { icon: Camera, title: "Photo Spots", desc: "AI-predicted golden hour locations." },
                { icon: Sparkles, title: "Hidden Gems", desc: "Off-beat destinations verified by locals." },
                { icon: Compass, title: "Live Guide", desc: "Real-time history and cultural insights." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500">
                    <item.icon size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleExploreClick}
              className="h-14 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg gap-3 shadow-2xl shadow-emerald-200 transition-all hover:scale-[1.02]"
            >
              Start Exploring <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80" 
                alt="Tourism Exploration" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 max-w-[280px] space-y-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-4 border-white" alt="user" />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-900">"The AI suggested a stop at a hidden lake I never knew existed!"</p>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">— Sarah, Explorer</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TourismSection;