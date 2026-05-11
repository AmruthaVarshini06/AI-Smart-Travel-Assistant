import mongoose from 'mongoose';

const touristPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Beach', 'Temple', 'Historical', 'Museum', 'Park', 'Waterfall', 'Food', 'Adventure', 'Nature'],
    required: true 
  },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  details: {
    entryFee: String,
    timings: String,
    bestTime: String,
    duration: String
  },
  nearby: {
    hotels: [{ name: String, rating: Number, distance: String }],
    restaurants: [{ name: String, cuisine: String, rating: Number }]
  }
}, { timestamps: true });

const TouristPlace = mongoose.model('TouristPlace', touristPlaceSchema);
export default TouristPlace;