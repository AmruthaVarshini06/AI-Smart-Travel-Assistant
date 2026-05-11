export type DestinationCategory = 'Beach' | 'Hill Station' | 'City' | 'Adventure' | 'Religious';
export type BudgetType =| "Budget"| "Mid-Range"| "Luxury";

export interface Destination {
  id: string;
  name: string;
  rating: number;
  image: string;
  description: string;
  category: DestinationCategory;
  tag?: string;
  popularity: number;
  budget: BudgetType;
  isTrending?: boolean;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'goa',
    name: 'Goa',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1512789172734-4b9809a46f6b?auto=format&fit=crop&w=800&q=80',
    description: 'Sun-kissed beaches, vibrant nightlife, and Portuguese heritage.',
    category: 'Beach',
    tag: 'Popular',
    popularity: 98,
    budget: 'Mid-Range',
    isTrending: true
  },
  {
    id: 'manali',
    name: 'Manali',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'Snow-capped peaks and adventure sports in the Himalayas.',
    category: 'Hill Station',
    tag: 'Best in Winter',
    popularity: 95,
    budget: 'Budget',
    isTrending: true
  },
  {
    id: 'mysore',
    name: 'Mysore',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Palaces, rich in history and royal heritage.',
    category: 'City',
    tag: 'Cultural Hub',
    popularity: 88,
    budget: 'Budget'
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1545105511-93d00d6745e2?auto=format&fit=crop&w=800&q=80',
    description: 'The Yoga Capital of the World and a hub for river rafting.',
    category: 'Adventure',
    tag: 'Trending',
    popularity: 92,
    budget: 'Budget',
    isTrending: true
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    description: 'One of the oldest living cities in the world on the banks of Ganga.',
    category: 'Religious',
    tag: 'Spiritual',
    popularity: 85,
    budget: 'Budget'
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?auto=format&fit=crop&w=800&q=80',
    description: 'High-altitude desert with stunning landscapes and monasteries.',
    category: 'Adventure',
    tag: 'Seasonal Pick',
    popularity: 94,
    budget: 'Luxury',
    isTrending: true
  },
  {
    id: 'kerala',
    name: 'kerala',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    description: 'Rolling tea gardens and misty mountains of the Western Ghats.',
    category: 'Hill Station',
    tag: 'Best in Summer',
    popularity: 91,
    budget: 'Mid-Range'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'The Pink City, famous for its forts and royal architecture.',
    category: 'City',
    tag: 'Popular',
    popularity: 90,
    budget: 'Mid-Range'
  }
];