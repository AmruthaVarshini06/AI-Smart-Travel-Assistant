"use client";

import React from 'react';
import Map from "@/components/Map";
import Navbar from '@/components/layout/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, TrendingUp, Info, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { showSuccess } from '@/utils/toast';

interface Destination {
  name: string;
  type: string;
  rating: number;
  price: string;
  description: string;
  img: string;
}

const Explore = () => {
  const [selectedDest, setSelectedDest] = React.useState<Destination | null>(null);

  const destinations: Destination[] = [
    { 
      name: 'Goa', 
      type: 'Beach', 
      rating: 4.8, 
      price: '₹4,500', 
      description: 'Famous for its beaches, ranging from popular stretches at Baga and Palolem to those in laid-back fishing villages such as Agonda.',
      img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' 
    },
    { 
      name: 'Manali', 
      type: 'Mountains', 
      rating: 4.9, 
      price: '₹3,200', 
      description: 'A high-altitude Himalayan resort town in India’s northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination.',
      img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80' 
    },
    { 
      name: 'Jaipur', 
      type: 'Heritage', 
      rating: 4.7, 
      price: '₹2,800', 
      description: 'The capital of India’s Rajasthan state. It evokes the royal family that once ruled the region and that, in 1727, founded what is now called the Old City.',
      img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80' 
    },
    { 
      name: 'Kerala', 
      type: 'Backwaters', 
      rating: 4.9, 
      price: '₹5,500', 
      description: 'A state on India\'s tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline. It\'s known for its palm-lined beaches and backwaters.',
      img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80' 
    },
  ];

  const handleBook = (name: string) => {
    showSuccess(`Booking process started for ${name}!`);
    setSelectedDest(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Destinations</h1>
          <p className="text-slate-500 text-sm">Discover trending places optimized for your travel style.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                <div className="h-48 overflow-hidden relative">
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 backdrop-blur-md border-none">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" /> {dest.rating}
                  </Badge>
                </div>
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{dest.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {dest.type}
                      </p>
                    </div>
                    <p className="font-bold text-primary">{dest.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3" /> High Demand
                  </div>

                  <div className="pt-2 mt-auto flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl text-xs font-bold h-9 border-slate-200 hover:bg-slate-50"
                      onClick={() => setSelectedDest(dest)}
                    >
                      <Info className="w-3.5 h-3.5 mr-1.5" /> Details
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl text-xs font-bold h-9 shadow-sm"
                      onClick={() => handleBook(dest.name)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Destination Details Dialog */}
        <Dialog open={!!selectedDest} onOpenChange={() => setSelectedDest(null)}>
          <DialogContent className="max-w-lg bg-white border-slate-200 rounded-[2rem]">
            <DialogHeader>
              <div className="h-48 w-full rounded-2xl overflow-hidden mb-4">
                <img src={selectedDest?.img} className="w-full h-full object-cover" alt={selectedDest?.name} />
              </div>
              <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                {selectedDest?.name}
                <Badge variant="secondary" className="rounded-full">{selectedDest?.type}</Badge>
              </DialogTitle>
              <DialogDescription className="text-slate-500 pt-2 leading-relaxed">
                {selectedDest?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Starting From</p>
                <p className="text-xl font-bold text-primary">{selectedDest?.price}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">User Rating</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <p className="text-xl font-bold">{selectedDest?.rating}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setSelectedDest(null)} className="rounded-xl">
                Close
              </Button>
              <Button onClick={() => handleBook(selectedDest?.name)} className="rounded-xl px-8 gap-2 shadow-lg shadow-primary/20">
                <CreditCard className="w-4 h-4" /> Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Explore;