"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight, Trash2, MoreVertical, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RouteDetails from '@/components/travel/RouteDetails';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showSuccess } from '@/utils/toast';

const MyTrips = () => {
  const [selectedTrip, setSelectedTrip] = React.useState<any | null>(null);
  const [trips, setTrips] = React.useState<any[]>([]);

  const loadTrips = () => {
    const storedTrips = JSON.parse(localStorage.getItem('bookedTrips') || '[]');
    setTrips(storedTrips);
  };

  React.useEffect(() => {
    loadTrips();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTrips = trips.filter(t => t.id !== id);
    localStorage.setItem('bookedTrips', JSON.stringify(updatedTrips));
    setTrips(updatedTrips);
    showSuccess("Trip removed successfully");
  };

  const getStatus = (dateStr: string) => {
    const tripDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    tripDate.setHours(0, 0, 0, 0);

    if (tripDate.getTime() === today.getTime()) return { label: 'Ongoing', color: 'bg-emerald-500' };
    if (tripDate.getTime() < today.getTime()) return { label: 'Completed', color: 'bg-slate-400' };
    return { label: 'Upcoming', color: 'bg-primary' };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-slate-500 text-sm">Manage your journeys and track their status.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {trips.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No trips found. Start planning your next journey!</p>
              </div>
            ) : (
              trips.map((trip, idx) => {
                const status = getStatus(trip.date);
                return (
                  <motion.div
                    key={trip.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card 
                      className="p-6 bg-white border-slate-200 hover:border-primary/30 transition-all group cursor-pointer shadow-sm rounded-3xl relative overflow-hidden"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl ${status.color}/10 flex items-center justify-center`}>
                            <Map className={`${status.color.replace('bg-', 'text-')} w-8 h-8`} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-slate-900">{trip.source} → {trip.destination}</h3>
                              <Badge className={`${status.color} text-white border-none rounded-full px-3`}>
                                {status.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(trip.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="flex items-center gap-1 font-bold text-primary">{trip.cost}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem 
                                className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer gap-2 font-bold"
                                onClick={(e) => handleDelete(trip.id, e)}
                              >
                                <Trash2 className="w-4 h-4" /> Remove Trip
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        <RouteDetails 
          route={selectedTrip?.fullRoute || null} 
          isOpen={!!selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
          searchedSource={selectedTrip?.source}
          searchedDest={selectedTrip?.destination}
          searchedDate={selectedTrip?.date}
          showBooking={false}
          isSatellite={true}
        />
      </main>
    </div>
  );
};

export default MyTrips;