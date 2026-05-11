export type AttractionCategory = 'Beach' | 'Temple' | 'Historical' | 'Museum' | 'Park' | 'Waterfall' | 'Food' | 'Adventure' | 'Nature';

export interface TouristPlace {
  id: string;
  name: string;
  category: AttractionCategory;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  lat: number; 
  lng: number;
  entryFee: string;
  timings: string;
  bestTime: string;
  duration: string;
  locationType: 'source' | 'route' | 'destination';
}

export const TOURIST_PLACES: TouristPlace[] = [
  // Hyderabad (Source)
  {
    id: 'h1',
    name: 'Charminar',
    category: 'Historical',
    rating: 4.6,
    reviews: 12400,
    image: 'https://images.unsplash.com/photo-1581330139730-09c399813939?auto=format&fit=crop&w=600&q=80',
    description: 'A 16th-century mosque and monument, iconic to Hyderabad.',
    lat: 17.3616, lng: 78.4747,
    entryFee: '₹25',
    timings: '9:30 AM - 5:30 PM',
    bestTime: 'October to March',
    duration: '1-2 hours',
    locationType: 'source'
  },
  {
    id: 'h2',
    name: 'Golconda Fort',
    category: 'Historical',
    rating: 4.7,
    reviews: 8500,
    image: 'https://images.unsplash.com/photo-1626191193300-66c700893690?auto=format&fit=crop&w=600&q=80',
    description: 'A massive fortress complex known for its acoustic effects.',
    lat: 17.3833, lng: 78.4011,
    entryFee: '₹15',
    timings: '9:00 AM - 5:30 PM',
    bestTime: 'Winter',
    duration: '3-4 hours',
    locationType: 'source'
  },
  // Along Route (Kurnool area)
  {
    id: 'r1',
    name: 'Kurnool Rock Garden',
    category: 'Park',
    rating: 4.2,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    description: 'Unique rock formations and scenic landscapes along the highway.',
    lat: 15.8285, lng: 78.0330,
    entryFee: 'Free',
    timings: 'Sunrise - Sunset',
    bestTime: 'Year-round',
    duration: '1 hour',
    locationType: 'route'
  },
  {
    id: 'r2',
    name: 'Belum Caves',
    category: 'Nature',
    rating: 4.8,
    reviews: 4500,
    image: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=600&q=80',
    description: 'The second largest cave system in the Indian subcontinent.',
    lat: 15.1023, lng: 78.1130,
    entryFee: '₹65',
    timings: '10:00 AM - 5:00 PM',
    bestTime: 'Winter',
    duration: '2-3 hours',
    locationType: 'route'
  },
  // Bangalore (Destination)
  {
    id: 'b1',
    name: 'Lalbagh Botanical Garden',
    category: 'Nature',
    rating: 4.5,
    reviews: 15000,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    description: 'A historic 240-acre garden with a glass house.',
    lat: 12.9507, lng: 77.5848,
    entryFee: '₹25',
    timings: '6:00 AM - 7:00 PM',
    bestTime: 'January/August',
    duration: '2 hours',
    locationType: 'destination'
  },
  {
    id: 'b2',
    name: 'Bangalore Palace',
    category: 'Historical',
    rating: 4.4,
    reviews: 9200,
    image: 'https://images.unsplash.com/photo-1590732487832-74242ce4d918?auto=format&fit=crop&w=800&q=80',
    description: 'A Tudor-style palace inspired by Windsor Castle.',
    lat: 12.9988, lng: 77.5921,
    entryFee: '₹230',
    timings: '10:00 AM - 5:30 PM',
    bestTime: 'Year-round',
    duration: '2-3 hours',
    locationType: 'destination'
  }
];

export const CATEGORY_COLORS: Record<AttractionCategory, string> = {
  Beach: 'bg-blue-500',
  Temple: 'bg-orange-500',
  Historical: 'bg-amber-700',
  Museum: 'bg-indigo-500',
  Park: 'bg-emerald-500',
  Waterfall: 'bg-cyan-500',
  Food: 'bg-rose-500',
  Adventure: 'bg-violet-500',
  Nature: 'bg-green-600'
};