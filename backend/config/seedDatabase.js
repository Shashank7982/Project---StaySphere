const mongoose = require('mongoose');
const connectDB = require('./database');
const Home = require('../models/home');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sampleListings = [
    // BEACHFRONT PROPERTIES (20)
    { houseName: "Luxury Beachfront Villa", price: "450", location: "Malibu, California", rating: "4.9", photo: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop", description: "Wake up to stunning ocean views in this luxurious beachfront villa.", rulesPdf: "", category: "beachfront" },
    { houseName: "Beachside Bungalow", price: "210", location: "Tulum, Mexico", rating: "4.8", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", description: "Bohemian beach house steps from white sand beaches.", rulesPdf: "", category: "beachfront" },
    { houseName: "Island Beach House", price: "550", location: "Maldives", rating: "5.0", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop", description: "Overwater villa with direct ocean access.", rulesPdf: "", category: "beachfront" },
    { houseName: "Hamptons Beach House", price: "580", location: "Hamptons, New York", rating: "4.9", photo: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop", description: "Classic Hamptons estate with private beach.", rulesPdf: "", category: "beachfront" },
    { houseName: "Bora Bora Overwater Villa", price: "750", location: "Bora Bora, French Polynesia", rating: "5.0", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop", description: "Ultimate luxury overwater bungalow.", rulesPdf: "", category: "beachfront" },
    { houseName: "Seychelles Beach Villa", price: "495", location: "Seychelles", rating: "5.0", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop", description: "Exclusive villa on powder-white beach.", rulesPdf: "", category: "beachfront" },
    { houseName: "Rio Beachfront Penthouse", price: "355", location: "Rio de Janeiro, Brazil", rating: "4.9", photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", description: "Copacabana penthouse with ocean views.", rulesPdf: "", category: "beachfront" },
    { houseName: "Fiji Island Bungalow", price: "385", location: "Fiji", rating: "5.0", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop", description: "Private island bungalow with coral reef.", rulesPdf: "", category: "beachfront" },
    { houseName: "Croatian Seaside Villa", price: "295", location: "Dubrovnik, Croatia", rating: "4.9", photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", description: "Stone villa overlooking Adriatic Sea.", rulesPdf: "", category: "beachfront" },
    { houseName: "Miami Beach Art Deco", price: "310", location: "Miami Beach, Florida", rating: "4.8", photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", description: "Restored 1930s Art Deco gem.", rulesPdf: "", category: "beachfront" },
    { houseName: "Bondi Beach Apartment", price: "275", location: "Sydney, Australia", rating: "4.8", photo: "https://images.unsplash.com/photo-1497360216509-53e9f8b4a2f4?w=800&h=600&fit=crop", description: "Modern apartment steps from iconic beach.", rulesPdf: "", category: "beachfront" },
    { houseName: "Phuket Beach Villa", price: "320", location: "Phuket, Thailand", rating: "4.9", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", description: "Tropical villa with private beach access.", rulesPdf: "", category: "beachfront" },
    { houseName: "Zanzibar Beach House", price: "265", location: "Zanzibar, Tanzania", rating: "4.7", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop", description: "Beachfront house with turquoise waters.", rulesPdf: "", category: "beachfront" },
    { houseName: "Barbados Coastal Villa", price: "425", location: "Barbados", rating: "4.9", photo: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop", description: "Luxury villa on pristine Caribbean beach.", rulesPdf: "", category: "beachfront" },
    { houseName: "Maui Beachfront Condo", price: "380", location: "Maui, Hawaii", rating: "4.8", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", description: "Oceanfront condo with sunset views.", rulesPdf: "", category: "beachfront" },
    { houseName: "Bali Beach Retreat", price: "290", location: "Seminyak, Bali", rating: "4.8", photo: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop", description: "Beachside retreat with infinity pool.", rulesPdf: "", category: "beachfront" },
    { houseName: "Costa Rica Beach House", price: "305", location: "Tamarindo, Costa Rica", rating: "4.7", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", description: "Surf paradise with ocean views.", rulesPdf: "", category: "beachfront" },
    { houseName: "Mykonos Beach Villa", price: "520", location: "Mykonos, Greece", rating: "5.0", photo: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop", description: "Whitewashed villa on Aegean Sea.", rulesPdf: "", category: "beachfront" },
    { houseName: "Cancun Beachfront Suite", price: "340", location: "Cancun, Mexico", rating: "4.8", photo: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop", description: "All-inclusive beachfront luxury.", rulesPdf: "", category: "beachfront" },
    { houseName: "Goa Beach Shack", price: "180", location: "Goa, India", rating: "4.6", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", description: "Charming beach shack with local vibes.", rulesPdf: "", category: "beachfront" },

    // AMAZING VIEWS (20)
    { houseName: "Coastal Cliffside Home", price: "410", location: "Big Sur, California", rating: "5.0", photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop", description: "Architectural masterpiece perched on coastal cliffs.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Santorini Cave House", price: "340", location: "Santorini, Greece", rating: "5.0", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Traditional cave house with caldera views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Cliffside Retreat", price: "445", location: "Amalfi Coast, Italy", rating: "5.0", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", description: "Dramatic cliffside villa overlooking Mediterranean.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Icelandic Glass Igloo", price: "425", location: "Reykjavik, Iceland", rating: "5.0", photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", description: "Glass igloo for Northern Lights viewing.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Harbor View Apartment", price: "260", location: "Sydney, Australia", rating: "4.8", photo: "https://images.unsplash.com/photo-1497360216509-53e9f8b4a2f4?w=800&h=600&fit=crop", description: "Contemporary apartment with Opera House views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Urban Penthouse Suite", price: "520", location: "Miami, Florida", rating: "5.0", photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", description: "Spectacular penthouse with 360-degree views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Singapore Sky Suite", price: "335", location: "Singapore", rating: "4.8", photo: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop", description: "High-rise suite with Marina Bay views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Istanbul Bosphorus Mansion", price: "405", location: "Istanbul, Turkey", rating: "4.9", photo: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop", description: "Ottoman-era mansion on Bosphorus.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Cape Town Mountain House", price: "365", location: "Cape Town, South Africa", rating: "4.9", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Modern home with Table Mountain views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Hong Kong Skyline Apartment", price: "395", location: "Hong Kong", rating: "4.8", photo: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop", description: "Luxury apartment with Victoria Harbour views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Swiss Alps Chalet", price: "480", location: "Interlaken, Switzerland", rating: "5.0", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", description: "Mountain chalet with Jungfrau views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Grand Canyon Lodge", price: "325", location: "Arizona, USA", rating: "4.9", photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", description: "Lodge on canyon rim with epic views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Positano Hillside Villa", price: "495", location: "Positano, Italy", rating: "5.0", photo: "https://images.unsplash.com/photo-1497360216509-53e9f8b4a2f4?w=800&h=600&fit=crop", description: "Terraced villa overlooking the coast.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Queenstown Lake House", price: "375", location: "Queenstown, New Zealand", rating: "4.9", photo: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop", description: "Lakefront house with mountain panorama.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Yosemite Valley Cabin", price: "285", location: "California, USA", rating: "4.8", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Cabin with Half Dome views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Dubai Marina Penthouse", price: "625", location: "Dubai, UAE", rating: "5.0", photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", description: "Ultra-luxury penthouse with skyline views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Lake Como Villa", price: "550", location: "Lake Como, Italy", rating: "5.0", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", description: "Historic villa on pristine lake.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Patagonia Mountain Lodge", price: "315", location: "Patagonia, Chile", rating: "4.8", photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", description: "Remote lodge with glacier views.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Cinque Terre Cliffside", price: "385", location: "Cinque Terre, Italy", rating: "4.9", photo: "https://images.unsplash.com/photo-1497360216509-53e9f8b4a2f4?w=800&h=600&fit=crop", description: "Colorful house on dramatic cliffs.", rulesPdf: "", category: "amazing-views" },
    { houseName: "Banff Mountain Retreat", price: "345", location: "Banff, Canada", rating: "4.9", photo: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop", description: "Luxury retreat in Canadian Rockies.", rulesPdf: "", category: "amazing-views" },

    // CABINS (20)
    { houseName: "Cozy Mountain Cabin", price: "180", location: "Aspen, Colorado", rating: "4.8", photo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop", description: "Charming mountain retreat surrounded by pine trees.", rulesPdf: "", category: "cabins" },
    { houseName: "Lakeside Cottage", price: "195", location: "Lake Tahoe, Nevada", rating: "4.7", photo: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800&h=600&fit=crop", description: "Peaceful lakeside cottage with private dock.", rulesPdf: "", category: "cabins" },
    { houseName: "Alpine Chalet Retreat", price: "290", location: "Zermatt, Switzerland", rating: "4.9", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Traditional Swiss chalet with Matterhorn views.", rulesPdf: "", category: "cabins" },
    { houseName: "Mountain View Cabin", price: "175", location: "Banff, Canada", rating: "4.7", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", description: "Rustic cabin with Rocky Mountain views.", rulesPdf: "", category: "cabins" },
    { houseName: "Riverside Cabin", price: "160", location: "Montana, USA", rating: "4.7", photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", description: "Peaceful cabin by rushing river.", rulesPdf: "", category: "cabins" },
    { houseName: "Norwegian Fjord Cabin", price: "265", location: "Bergen, Norway", rating: "4.8", photo: "https://images.unsplash.com/photo-1497360216509-53e9f8b4a2f4?w=800&h=600&fit=crop", description: "Waterfront cabin on pristine fjord.", rulesPdf: "", category: "cabins" },
    { houseName: "Yellowstone Park Cabin", price: "235", location: "Wyoming, USA", rating: "4.8", photo: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop", description: "Rustic cabin near park entrance.", rulesPdf: "", category: "cabins" },
    { houseName: "Vermont Farmhouse", price: "190", location: "Vermont, USA", rating: "4.8", photo: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop", description: "Charming farmhouse with mountain views.", rulesPdf: "", category: "cabins" },
    { houseName: "Alaskan Wilderness Lodge", price: "325", location: "Alaska, USA", rating: "4.8", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Remote lodge accessible by seaplane.", rulesPdf: "", category: "cabins" },
    { houseName: "Smoky Mountains Cabin", price: "205", location: "Tennessee, USA", rating: "4.7", photo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop", description: "Secluded cabin in the Smokies.", rulesPdf: "", category: "cabins" },
    { houseName: "Black Forest Cabin", price: "225", location: "Black Forest, Germany", rating: "4.8", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", description: "Traditional cabin in enchanted forest.", rulesPdf: "", category: "cabins" },
    { houseName: "Adirondack Log Cabin", price: "185", location: "New York, USA", rating: "4.6", photo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop", description: "Classic log cabin by the lake.", rulesPdf: "", category: "cabins" },
    { houseName: "Finnish Lakeside Cabin", price: "210", location: "Lapland, Finland", rating: "4.9", photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", description: "Sauna cabin with Northern Lights.", rulesPdf: "", category: "cabins" },
    { houseName: "Scottish Highlands Cottage", price: "195", location: "Highlands, Scotland", rating: "4.7", photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop", description: "Stone cottage in dramatic highlands.", rulesPdf: "", category: "cabins" },
    { houseName: "Colorado Ski Cabin", price: "275", location: "Breckenridge, Colorado", rating: "4.8", photo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop", description: "Ski-in/ski-out mountain cabin.", rulesPdf: "", category: "cabins" },
    { houseName: "Oregon Forest Retreat", price: "170", location: "Oregon, USA", rating: "4.6", photo: "https://images.unsplash.com/photo-1497360216509-53e9f8b4a2f4?w=800&h=600&fit=crop", description: "Eco-cabin in old-growth forest.", rulesPdf: "", category: "cabins" },
    { houseName: "Austrian Mountain Hut", price: "240", location: "Tyrol, Austria", rating: "4.8", photo: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop", description: "Alpine hut with panoramic views.", rulesPdf: "", category: "cabins" },
    { houseName: "Maine Coastal Cabin", price: "215", location: "Maine, USA", rating: "4.7", photo: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800&h=600&fit=crop", description: "Rustic cabin on rocky coast.", rulesPdf: "", category: "cabins" },
    { houseName: "Swedish Wilderness Cabin", price: "190", location: "Swedish Lapland", rating: "4.8", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Off-grid cabin in pristine wilderness.", rulesPdf: "", category: "cabins" },
    { houseName: "New Zealand Bush Cabin", price: "220", location: "South Island, New Zealand", rating: "4.7", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", description: "Secluded cabin in native bush.", rulesPdf: "", category: "cabins" },

    // LAST MINUTE (20)
    { houseName: "Modern Downtown Loft", price: "220", location: "New York, NY", rating: "4.7", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Stylish industrial loft in Manhattan.", rulesPdf: "", category: "last-minute" },
    { houseName: "City Center Studio", price: "125", location: "Barcelona, Spain", rating: "4.6", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Modern studio in Gothic Quarter.", rulesPdf: "", category: "last-minute" },
    { houseName: "Tokyo Minimalist Studio", price: "155", location: "Tokyo, Japan", rating: "4.6", photo: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop", description: "Sleek studio in Shibuya.", rulesPdf: "", category: "last-minute" },
    { houseName: "Urban Warehouse Loft", price: "245", location: "Brooklyn, New York", rating: "4.7", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Converted warehouse with industrial charm.", rulesPdf: "", category: "last-minute" },
    { houseName: "Austin Music District Loft", price: "215", location: "Austin, Texas", rating: "4.7", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Hip loft in live music capital.", rulesPdf: "", category: "last-minute" },
    { houseName: "Buenos Aires Tango Apartment", price: "145", location: "Buenos Aires, Argentina", rating: "4.6", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Stylish apartment in Palermo.", rulesPdf: "", category: "last-minute" },
    { houseName: "Portland Tiny House", price: "95", location: "Portland, Oregon", rating: "4.5", photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", description: "Eco-friendly tiny house in urban setting.", rulesPdf: "", category: "last-minute" },
    { houseName: "Prague Castle View Apartment", price: "225", location: "Prague, Czech Republic", rating: "4.8", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Historic apartment with castle views.", rulesPdf: "", category: "last-minute" },
    { houseName: "Nashville Music Row Studio", price: "175", location: "Nashville, Tennessee", rating: "4.7", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Stylish studio near honky-tonks.", rulesPdf: "", category: "last-minute" },
    { houseName: "Copenhagen Canal House", price: "305", location: "Copenhagen, Denmark", rating: "4.8", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Colorful canal house in Nyhavn.", rulesPdf: "", category: "last-minute" },
    { houseName: "Berlin Kreuzberg Loft", price: "195", location: "Berlin, Germany", rating: "4.7", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Trendy loft in vibrant neighborhood.", rulesPdf: "", category: "last-minute" },
    { houseName: "London Shoreditch Flat", price: "285", location: "London, UK", rating: "4.7", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Modern flat in creative district.", rulesPdf: "", category: "last-minute" },
    { houseName: "Melbourne CBD Apartment", price: "205", location: "Melbourne, Australia", rating: "4.6", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Central apartment near laneways.", rulesPdf: "", category: "last-minute" },
    { houseName: "Amsterdam Canal Apartment", price: "265", location: "Amsterdam, Netherlands", rating: "4.8", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Charming apartment on historic canal.", rulesPdf: "", category: "last-minute" },
    { houseName: "San Francisco Mission Loft", price: "295", location: "San Francisco, California", rating: "4.7", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Artistic loft in Mission District.", rulesPdf: "", category: "last-minute" },
    { houseName: "Montreal Plateau Apartment", price: "165", location: "Montreal, Canada", rating: "4.6", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Cozy apartment in trendy Plateau.", rulesPdf: "", category: "last-minute" },
    { houseName: "Seattle Downtown Studio", price: "185", location: "Seattle, Washington", rating: "4.6", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Modern studio near Pike Place.", rulesPdf: "", category: "last-minute" },
    { houseName: "Dublin Temple Bar Flat", price: "235", location: "Dublin, Ireland", rating: "4.7", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Vibrant flat in cultural quarter.", rulesPdf: "", category: "last-minute" },
    { houseName: "Lisbon Alfama Apartment", price: "175", location: "Lisbon, Portugal", rating: "4.7", photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop", description: "Historic apartment in old town.", rulesPdf: "", category: "last-minute" },
    { houseName: "Chicago Loop Loft", price: "255", location: "Chicago, Illinois", rating: "4.7", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Urban loft with skyline views.", rulesPdf: "", category: "last-minute" }
];

const sampleAmenities = [
  'High-speed Wi-Fi', 'Swimming pool', 'Air conditioning', 'Fully equipped kitchen', 
  'Free parking on premises', 'Dedicated workspace', 'Hot tub', 'HDTV with Netflix', 'Washing machine'
];

const sampleReviewsList = [
  { author: "Alice Jenkins", rating: 5, comment: "Absolutely incredible! The views were breathtaking and everything was clean." },
  { author: "Michael Smith", rating: 4, comment: "Great location and very cozy space. Highly recommend!" },
  { author: "Emma Watson", rating: 5, comment: "A perfect getaway. The host was very responsive and helpful." },
  { author: "David Miller", rating: 4, comment: "Clean, comfortable, and close to everything we wanted to do." },
  { author: "Sophia Brown", rating: 5, comment: "Felt like home. Beautiful design and great amenities." }
];

// Add amenities and reviews to predefined listings
sampleListings.forEach((listing, index) => {
  listing.amenities = sampleAmenities.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 4);
  listing.reviews = sampleReviewsList.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
});

// If we have fewer than 150 listings, generate additional filler entries
while (sampleListings.length < 150) {
  const index = sampleListings.length + 1;
  const amenities = sampleAmenities.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 4);
  const reviews = sampleReviewsList.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);

  sampleListings.push({
    houseName: `Extra Stay ${index}`,
    price: `${Math.floor(Math.random() * 500) + 100}`,
    location: 'Global',
    rating: (Math.random() * 1.2 + 3.8).toFixed(1),
    photo: `https://picsum.photos/seed/extra${index}/800/600`,
    description: `A beautiful and comfortable place to stay. Experience modern design and cozy luxury. Located in a scenic spot, perfect for your holiday.`,
    rulesPdf: '',
    category: 'luxury',
    amenities,
    reviews
  });
}


const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('🗑️  Clearing existing data...');
        await Home.deleteMany({});
        await User.deleteMany({});

        console.log('🏠 Creating 80 sample listings (20 per category)...');
        const homes = await Home.insertMany(sampleListings);
        console.log(`✅ Created ${homes.length} listings`);

        console.log('👤 Creating sample users...');
        const hashedPassword = await bcrypt.hash('password123', 12);

        const users = await User.insertMany([
            { firstName: 'John', lastName: 'Doe', email: 'guest@example.com', password: hashedPassword, userType: 'guest', favourites: [] },
            { firstName: 'Jane', lastName: 'Smith', email: 'host@example.com', password: hashedPassword, userType: 'host', favourites: [] }
        ]);
        console.log(`✅ Created ${users.length} users`);

        console.log('\n✨ Database seeded successfully with 80 properties!');
        console.log('   - Beachfront: 20 listings');
        console.log('   - Amazing Views: 20 listings');
        console.log('   - Cabins: 20 listings');
        console.log('   - Last Minute: 20 listings');
        console.log('\n📝 Sample login credentials:');
        console.log('   Guest: guest@example.com / password123');
        console.log('   Host: host@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
