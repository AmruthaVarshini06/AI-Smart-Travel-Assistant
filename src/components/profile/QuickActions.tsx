"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Navigation, Bookmark, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    { icon: Navigation, label: 'Plan New Trip', color: 'text-blue-500', bg: 'bg-blue-50', path: '/navigate' },
    { icon: Bookmark, label: 'View Bookings', color: 'text-emerald-500', bg: 'bg-emerald-50', path: '/trips' },
    { icon: Heart, label: 'Saved Places', color: 'text-rose-500', bg: 'bg-rose-50', path: '/explore' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black text-slate-900">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group text-center space-y-3"
          >
            <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center mx-auto transition-transform group-hover:scale-110`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <p className="text-sm font-black text-slate-900">{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
