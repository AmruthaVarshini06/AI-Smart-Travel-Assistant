"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Map from "@/components/Map";
import MapView from "@/components/MapView";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RouteCard from '@/components/travel/RouteCard';
import AIAssistant from '@/components/travel/AIAssistant';
import SearchForm from '@/components/travel/SearchForm';
import AIInsights from '@/components/travel/AIInsights';
import RouteDetails from '@/components/travel/RouteDetails';
import { WeatherWidget, PricePrediction } from '@/components/travel/TravelWidgets';
import { WeatherCondition, TravelRoute } from '@/lib/mock-data';
import { fetchTravelPlan } from '@/lib/api';
import { showError, showSuccess } from '@/utils/toast';

const Index = () => {
  const [travelStyle] = React.useState<'balanced' | 'fastest' | 'cheapest'>('balanced');
  const [distance] = React.useState([600]);
  const [weather] = React.useState<WeatherCondition>('Clear');
  const [routes, setRoutes] = React.useState<TravelRoute[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedRoute, setSelectedRoute] = React.useState<TravelRoute | null>(null);
  const [searchParams, setSearchParams] = React.useState({ 
    source: 'Hyderabad', 
    dest: 'Bangalore',
    date: new Date().toISOString().split('T')[0]
  });

  const loadRoutes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTravelPlan({
        source: searchParams.source,
        destination: searchParams.dest,
        distance: distance[0],
        style: travelStyle,
        weather: weather
      });
      
      // Sort routes: Recommended (Best Choice) first
      const sortedData = [...data].sort((a, b) => {
        if (a.type === 'recommended') return -1;
        if (b.type === 'recommended') return 1;
        return 0;
      });
      
      setRoutes(sortedData);
    } catch (err) {
      showError("Failed to fetch travel plans");
    } finally {
      setIsLoading(false);
    }
  }, [distance, travelStyle, weather, searchParams]);

  const handleSearch = (source: string, dest: string, date: string = searchParams.date) => {
    setSearchParams(prev => ({ ...prev, source, dest, date }));
    showSuccess(`Searching routes from ${source} to ${dest}`);
  };

  React.useEffect(() => {
    loadRoutes();
  }, [searchParams, loadRoutes]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto max-w-7xl">
        <DashboardHeader />

        <div className="my-8">
          <Map />
        </div>
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
            </div>
          </div>

          {/* Right Column: AI Assistant and Widgets Grid */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="sticky top-24 space-y-8">
              <AIAssistant weather={weather} distance={distance[0]} />
              
              <div className="grid grid-cols-1 gap-6">
                <AIInsights />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                  <WeatherWidget />
                  <PricePrediction />
                </div>
              </div>
            </div>
          </div>
        </div>

        <RouteDetails 
          route={selectedRoute} 
          isOpen={!!selectedRoute} 
          onClose={() => setSelectedRoute(null)} 
          searchedSource={searchParams.source}
          searchedDest={searchParams.dest}
          searchedDate={searchParams.date}
        />
      </main>
    </div>
  );
};

export default Index;