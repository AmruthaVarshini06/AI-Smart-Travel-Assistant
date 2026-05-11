"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Navigation, 
  Compass, 
  MessageSquare, 
  Bell, 
  Bookmark 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LandingHero = () => {
  const navigate = useNavigate();

  const modules = [
    { 
      icon: Navigation, 
      title: "Smart Navigate", 
      desc: "Multi-modal route planning with real-time optimization.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    { 
      icon: MessageSquare, 
      title: "AI Concierge", 
      desc: "Your personal travel assistant powered by Gemini AI.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      icon: Compass, 
      title: "Explore", 
      desc: "Discover hidden gems and iconic landmarks along your path.",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    { 
      icon: Bell, 
      title: "Live Alerts", 
      desc: "Stay updated with weather warnings and price drop notifications.",
      color: "text-amber-500",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="relative py-12 lg:py-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 text-center space-y-12">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-full shadow-xl shadow-slate-200/50"
          >
            <Sparkles className="text-primary w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Next-Gen Travel Intelligence
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900">
              Your Journey, <span className="text-primary">Optimized</span> by Neural Networks.
            </h1>
            <p className="text-lg lg:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Experience the future of travel planning. Our AI engine analyzes thousands of routes to find your perfect path in seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button 
              onClick={() => navigate('/navigate')}
              className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02]"
            >
              Start Navigating <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/assistant')}
              className="h-14 px-10 rounded-2xl border-slate-200 bg-white font-bold text-lg text-slate-600 hover:bg-slate-50 transition-all"
            >
              Chat with AI
            </Button>
          </motion.div>
        </div>

        {/* Modules Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12"
        >
          {modules.map((module, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group text-left space-y-4"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", module.bg)}>
                <module.icon className={cn("w-6 h-6", module.color)} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">{module.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{module.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-slate-100"
        >
          {[
            { icon: Globe, label: "Global Coverage", value: "50k+ Routes" },
            { icon: Zap, label: "Instant Planning", value: "< 2 Seconds" },
            { icon: ShieldCheck, label: "Reliability Score", value: "99.9% Accurate" },
            { icon: Sparkles, label: "AI Insights", value: "Smart Tips" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-center">
                <stat.icon className="w-6 h-6 text-primary/40" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingHero;