"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle2, Clock, Trash2, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = React.useState([
    { id: 1, type: 'warning', title: 'Weather Alert: Bangalore', desc: 'Heavy rain expected tomorrow. Expect 15-20 min delays on rail routes.', time: '2h ago', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 2, type: 'info', title: 'Price Drop: Mumbai Flight', desc: 'Prices for your tracked route have dropped by 12%. Book now to save ₹800.', time: '5h ago', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, type: 'success', title: 'Booking Confirmed', desc: 'Your trip to Hyderabad has been successfully confirmed. Tickets sent to email.', time: '1d ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ]);

  const clearAll = () => {
    setAlerts([]);
    showSuccess("All alerts cleared");
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Travel Alerts</h1>
            <p className="text-slate-500 text-sm">Stay updated with real-time travel intelligence.</p>
          </div>
          {alerts.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearAll}
              className="rounded-xl border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all gap-2 font-bold"
            >
              <Trash2 size={16} /> Clear All
            </Button>
          )}
        </div>

        <div className="max-w-3xl space-y-4">
          <AnimatePresence mode="popLayout">
            {alerts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">You're all caught up! No new alerts.</p>
              </motion.div>
            ) : (
              alerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 border-slate-200 shadow-sm flex gap-4 items-start hover:border-primary/20 transition-all group rounded-3xl relative overflow-hidden">
                    <div className={`p-3 rounded-2xl ${alert.bg}`}>
                      <alert.icon className={`w-6 h-6 ${alert.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">{alert.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                            <Clock className="w-3 h-3" /> {alert.time}
                          </span>
                          <button 
                            onClick={() => removeAlert(alert.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{alert.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-8"
            >
              <Card className="p-8 bg-primary/5 border-primary/10 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute -right-8 -top-8 opacity-10">
                  <Sparkles size={120} className="text-primary" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-white p-4 rounded-3xl shadow-xl shadow-primary/10">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <h3 className="text-xl font-black text-slate-900">Need help with these alerts?</h3>
                    <p className="text-slate-500 text-sm font-medium">Our AI Assistant can help you find alternative routes or resolve travel issues.</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/assistant')}
                    className="rounded-2xl h-12 px-8 font-black gap-2 shadow-lg shadow-primary/20"
                  >
                    Chat with AI <Sparkles size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;