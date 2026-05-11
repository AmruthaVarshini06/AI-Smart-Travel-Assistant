"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import TourismMap from '@/components/tourism/TourismMap';
import PlaceDetailsPanel from '@/components/tourism/PlaceDetailsPanel';
import TripSummary from '@/components/tourism/TripSummary';
import DestinationCard from '@/components/explore/DestinationCard';
import { DESTINATIONS, Destination, DestinationCategory } from '@/lib/explore-data';
import { TOURIST_PLACES, TouristPlace } from '@/lib/tourism-data';
import { showSuccess, showError } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Trash2, Map as MapIcon, Play, Sparkles, Compass, Loader2, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

<<<<<<< HEAD
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
=======
const Explore = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = React.useState<'discovery' | 'split'>('discovery');
  const [activeDestination, setActiveDestination] = React.useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<DestinationCategory | 'All'>('All');
  
  const [selectedPlaceIds, setSelectedPlaceIds] = React.useState<string[]>([]);
  const [visitedPlaceIds, setVisitedPlaceIds] = React.useState<string[]>([]);
  const [skippedPlaceIds, setSkippedPlaceIds] = React.useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = React.useState<TouristPlace | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [mobileSubView, setMobileSubView] = React.useState<'map' | 'details'>('map');

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
>>>>>>> origin/main

  const handleExplore = (dest: Destination) => {
    setActiveDestination(dest);
    setViewMode('split');
    setMobileSubView('map');
    setSelectedPlace(null);
  };

  const handlePlaceClick = (place: TouristPlace) => {
    setSelectedPlace(place);
    if (isMobile) {
      setMobileSubView('details');
    }
  };

  const togglePlaceSelection = (id: string) => {
    setSelectedPlaceIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleVisited = (id: string) => {
    setVisitedPlaceIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    setSkippedPlaceIds(prev => prev.filter(p => p !== id));
  };

  const toggleSkipped = (id: string) => {
    setSkippedPlaceIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    setVisitedPlaceIds(prev => prev.filter(p => p !== id));
  };

  const removePlace = (id: string) => {
    setSelectedPlaceIds(prev => prev.filter(p => p !== id));
    setVisitedPlaceIds(prev => prev.filter(p => p !== id));
    setSkippedPlaceIds(prev => prev.filter(p => p !== id));
  };

  const addedPlaces = TOURIST_PLACES.filter(p => selectedPlaceIds.includes(p.id));

  const handleCompleteTrip = async () => {

  setIsSaving(true);

  const totalCost =
    addedPlaces.reduce(
      (acc, p) =>
        acc +
        (parseInt(
          p.entryFee.replace(/[^0-9]/g, '')
        ) || 0),
      0
    ) + 500;

  const tripData = {

    destination:
      activeDestination?.name ||
      'Custom Route',

    source: 'Hyderabad',

    date:
      new Date()
        .toISOString()
        .split('T')[0],

    status: 'Ongoing',

    mode: 'Multi-modal',

    cost: totalCost,

    full_route: {

      id: `tour-${Date.now()}`,

      totalDuration:
        addedPlaces.length > 0
          ? addedPlaces.length * 120
          : 480,

      totalCost: totalCost,

      reliabilityScore: 98,

      type: 'recommended',

      segments:
        addedPlaces.length > 0
          ? addedPlaces.map((p, i) => ({

              mode: 'cab',

              from:
                i === 0
                  ? 'Hyderabad'
                  : addedPlaces[i - 1].name,

              to: p.name,

              duration: 60,

              cost: 150,

              departureTime: `${10 + i}:00`,

              arrivalTime: `${11 + i}:00`,

              delayRisk: 0.02,

              attractions: [p.name]

            }))
          : [{

              mode: 'cab',

              from: 'Hyderabad',

              to:
                activeDestination?.name ||
                'Destination',

              duration: 480,

              cost: 500,

              departureTime: '08:00',

              arrivalTime: '16:00',

              delayRisk: 0.05,

              attractions: []

            }]
    }
  };

  try {

    await axios.post(
      "http://localhost:5000/api/trips/book",
      tripData
    );

    showSuccess(
      "Journey started successfully!"
    );

  } catch (err) {

    console.log(err);

    // fallback local storage
    const existingTrips = JSON.parse(
      localStorage.getItem(
        'bookedTrips'
      ) || '[]'
    );

    localStorage.setItem(
      'bookedTrips',
      JSON.stringify([
        {
          ...tripData,
          id: Date.now().toString()
        },
        ...existingTrips
      ])
    );

    showError(
      "Saved locally because server failed."
    );

  } finally {

    setIsSaving(false);

    navigate('/trips');
  }
};

  return (
    <div className="h-screen w-full bg-[#fcfdfe] flex flex-col overflow-hidden">
      <Navbar />
<<<<<<< HEAD
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
=======
      
      <main className="flex-1 pt-16 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {viewMode === 'discovery' ? (
            <motion.div 
              key="discovery"
              initial={{ opacity: 0, y: 10 }}
>>>>>>> origin/main
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto custom-scrollbar p-4 lg:p-12"
            >
              <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                      <Sparkles size={12} /> Your Journey Starts Here
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-tight text-gradient">
                      Explore <span className="text-primary">Destinations.</span>
                    </h1>
                    <p className="text-slate-500 text-sm lg:text-base font-medium max-w-md">
                      Discover hidden gems and iconic landmarks curated by our neural travel engine.
                    </p>
                  </div>

                  <div className="relative w-full lg:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Where to next?"
                      className="pl-12 h-12 lg:h-14 rounded-2xl border-slate-200 bg-white shadow-lg text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-6 lg:space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Compass className="text-primary w-5 h-5" />
                      <h2 className="text-lg lg:text-xl font-black">Popular Picks</h2>
                    </div>
                    <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto no-scrollbar">
                      {['All', 'Beach', 'Hill Station', 'City'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat as any)}
                          className={cn(
                            "px-3 lg:px-4 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                            selectedCategory === cat ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                    {filteredDestinations.map((dest) => (
                      <DestinationCard key={dest.id} destination={dest} onExplore={handleExplore} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-full flex flex-col lg:grid lg:grid-cols-[35%_40%_25%] overflow-hidden"
            >
              {/* MOBILE VIEW LOGIC */}
              {isMobile ? (
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    {mobileSubView === 'map' ? (
                      <motion.div 
                        key="mobile-map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 relative"
                      >
                        <div className="absolute top-4 left-4 z-50">
                          <Button 
                            onClick={() => setViewMode('discovery')}
                            variant="secondary" 
                            size="icon"
                            className="rounded-xl w-10 h-10 shadow-xl bg-white/90 backdrop-blur-xl"
                          >
                            <ChevronLeft size={18} />
                          </Button>
                        </div>
                        <TourismMap 
                          places={TOURIST_PLACES}
                          selectedPlaces={selectedPlaceIds}
                          visitedPlaces={visitedPlaceIds}
                          skippedPlaces={skippedPlaceIds}
                          onPlaceClick={handlePlaceClick}
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="mobile-details"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="flex-1 bg-white overflow-hidden flex flex-col"
                      >
                        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                          <Button variant="ghost" size="icon" onClick={() => setMobileSubView('map')}>
                            <ChevronLeft size={20} />
                          </Button>
                          <h3 className="font-black text-slate-900">Place Details</h3>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <PlaceDetailsPanel 
                            place={selectedPlace}
                            isSelected={selectedPlace ? selectedPlaceIds.includes(selectedPlace.id) : false}
                            isVisited={selectedPlace ? visitedPlaceIds.includes(selectedPlace.id) : false}
                            isSkipped={selectedPlace ? skippedPlaceIds.includes(selectedPlace.id) : false}
                            onToggleSelect={togglePlaceSelection}
                            onToggleVisited={toggleVisited}
                            onToggleSkipped={toggleSkipped}
                            onSaveTrip={() => {}}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Fixed Mobile Bottom Bar */}
                  <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 shrink-0">
                          <List size={20} />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="rounded-t-[2rem] h-[70vh] p-0 overflow-hidden flex flex-col">
                        <SheetHeader className="p-6 border-b border-slate-100">
                          <SheetTitle className="flex items-center gap-2">
                            <MapIcon className="text-primary" /> Your Trip Plan
                          </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                          {addedPlaces.length === 0 ? (
                            <p className="text-center text-slate-400 py-10">No places added yet.</p>
                          ) : (
                            addedPlaces.map(place => (
                              <div key={place.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-slate-900">{place.name}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-black">{place.category}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removePlace(place.id)} className="text-slate-300 hover:text-red-500">
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    <Button 
                      disabled={isSaving}
                      onClick={handleCompleteTrip}
                      className="flex-1 h-12 rounded-xl font-black text-sm gap-2 shadow-xl shadow-primary/20"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play size={16} fill="currentColor" />}
                      Start Full Journey
                    </Button>
                  </div>
                </div>
              ) : (
                /* DESKTOP VIEW (3 COLUMNS) */
                <>
                  <div className="relative overflow-hidden border-r border-slate-100 bg-slate-50/30">
                    <div className="absolute top-4 left-4 z-50">
                      <Button 
                        onClick={() => setViewMode('discovery')}
                        variant="secondary" 
                        size="icon"
                        className="rounded-xl w-10 h-10 shadow-xl bg-white/90 backdrop-blur-xl"
                      >
                        <ChevronLeft size={18} />
                      </Button>
                    </div>
                    <TourismMap 
                      places={TOURIST_PLACES}
                      selectedPlaces={selectedPlaceIds}
                      visitedPlaces={visitedPlaceIds}
                      skippedPlaces={skippedPlaceIds}
                      onPlaceClick={handlePlaceClick}
                    />
                  </div>

                  <div className="border-r border-slate-100 overflow-hidden bg-white">
                    <PlaceDetailsPanel 
                      place={selectedPlace}
                      isSelected={selectedPlace ? selectedPlaceIds.includes(selectedPlace.id) : false}
                      isVisited={selectedPlace ? visitedPlaceIds.includes(selectedPlace.id) : false}
                      isSkipped={selectedPlace ? skippedPlaceIds.includes(selectedPlace.id) : false}
                      onToggleSelect={togglePlaceSelection}
                      onToggleVisited={toggleVisited}
                      onToggleSkipped={toggleSkipped}
                      onSaveTrip={() => {}}
                    />
                  </div>

                  <div className="bg-slate-50/50 flex flex-col overflow-hidden">
                    <div className="shrink-0 border-b border-slate-100 bg-white">
                      <TripSummary 
                        selectedCount={selectedPlaceIds.length}
                        distance={620}
                        duration="8h 30m"
                        budget={addedPlaces.reduce((acc, p) => acc + (parseInt(p.entryFee.replace(/[^0-9]/g, '')) || 0), 0) + 500}
                        aiScore={92}
                        onComplete={handleCompleteTrip}
                      />
                    </div>

                    <div className="p-4 border-b border-slate-100 bg-white/50 shrink-0">
                      <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400">
                        <MapIcon size={14} className="text-primary" /> Your Trip Plan
                      </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      <AnimatePresence mode="popLayout">
                        {addedPlaces.length === 0 ? (
                          <div className="text-center py-10 opacity-20">
                            <MapIcon size={32} className="mx-auto mb-2" />
                            <p className="text-[8px] font-black uppercase tracking-widest">No places added</p>
                          </div>
                        ) : (
                          addedPlaces.map((place) => (
                            <motion.div 
                              key={place.id}
                              layout
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"
                            >
                              <div>
                                <p className="text-xs font-black text-slate-900">{place.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{place.category}</p>
                              </div>
                              <button onClick={() => removePlace(place.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                      <Button 
                        disabled={isSaving}
                        onClick={handleCompleteTrip}
                        className="w-full h-12 rounded-2xl font-black text-sm gap-2 shadow-xl shadow-primary/20"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play size={16} fill="currentColor" />}
                        {isSaving ? 'Starting...' : "Let's Start My Trip"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Explore;