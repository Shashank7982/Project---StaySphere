const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }
});

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: String, required: true },
  photo: String,
  description: String,
  rulesPdf: String,
  category: { type: String, enum: ['beachfront', 'amazing-views', 'cabins', 'last-minute', 'trending', 'countryside', 'luxe', 'design', 'all', 'luxury'], default: 'all' },
  amenities: { type: [String], default: [] },
  reviews: [reviewSchema]
});

module.exports = mongoose.model("Home", homeSchema);