"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import LandingHero from '@/components/home/LandingHero';
import DemoRoutes from '@/components/home/DemoRoutes';
import TourismSection from '@/components/home/TourismSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 flex flex-col">
      <Navbar />
<<<<<<< HEAD
      
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto max-w-7xl">
        <DashboardHeader />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Search and Routes */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black tracking-tight">Recommended Routes</h2>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {searchParams.source} to {searchParams.dest}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2rem] animate-pulse" />
                    ))}
                  </div>
                ) : (
                  routes.map((route, idx) => (
                    <RouteCard 
                      key={route.id} 
                      route={route} 
                      index={idx} 
                      onViewDetails={(r) => setSelectedRoute(r)}
                    />
                  ))
                )}
              </div>
=======
      <main className="flex-1 pt-24">
        <LandingHero />
        <DemoRoutes />
        <TourismSection />
        
        <div className="container mx-auto px-4 py-24 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tighter">Why choose AI Travel?</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Traditional travel planners only look at one mode of transport at a time. Our neural engine considers flights, trains, buses, and cabs simultaneously to find the most efficient path for your specific needs.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time delay predictions using ML",
                  "Carbon footprint optimization",
                  "Integrated AI travel concierge",
                  "Dynamic price tracking and alerts"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
>>>>>>> origin/main
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-slate-100 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" 
                  alt="Travel Planning" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[200px]">
                <p className="text-3xl font-black text-primary">94%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Reliability</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;