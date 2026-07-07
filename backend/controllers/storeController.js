// CORE MODULES
const mongoose = require('mongoose');
const path = require('path');
// LOCAL MODULES
const Home = require('../models/home');
const User = require('../models/user');
const favourites = require('../models/favourites');
const rootDir = require('../utils/pathUtils');
const Booking = require('../models/booking');


exports.getIndex = (req, res, next) => {
    const category = req.query.category;
    let query = {};
    if (category && category !== 'all') {
        query.category = category;
    }

    Home.find(query).then(registeredHomes => {
        res.json({
            homes: registeredHomes,
            currentCategory: category || 'all',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user || null
        });
    }).catch(next);
};

exports.getHomes = (req, res, next) => {
    const category = req.query.category;
    let query = {};
    if (category && category !== 'all') {
        query.category = category;
    }

    Home.find(query).then(registeredHomes => {
        res.json({
            homes: registeredHomes,
            currentCategory: category || 'all',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user || null
        });
    }).catch(next);
};

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;

    Home.findById(homeId).then(home => {
        if (!home) {
            return res.status(404).json({ error: 'Home not found' });
        }
        res.json({ home, isLoggedIn: req.isLoggedIn, user: req.session.user || null });
    }).catch(next);
};

exports.getBookings = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) {
        return res.status(401).json({ error: 'Please log in' });
    }
    try {
        const userId = req.session.user._id;
        const bookings = await Booking.find({ user: userId }).populate('home');
        res.json({
            bookings,
            isLoggedIn: req.isLoggedIn,
            user: req.session.user || null
        });
    } catch (err) {
        next(err);
    }
};

exports.postBooking = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) {
        return res.status(401).json({ error: 'Please log in to book a stay' });
    }
    try {
        const userId = req.session.user._id;
        const { homeId, checkIn, checkOut, guests, totalPrice } = req.body;

        if (!homeId || !checkIn || !checkOut || !guests || !totalPrice) {
            return res.status(400).json({ error: 'Missing booking details' });
        }

        const booking = new Booking({
            user: userId,
            home: homeId,
            checkIn,
            checkOut,
            guests,
            totalPrice
        });

        await booking.save();
        res.status(201).json({ message: 'Booking reserved successfully', booking });
    } catch (err) {
        next(err);
    }
};


exports.getFavouriteList = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) {
        return res.status(401).json({ error: 'Please log in to view favourites' });
    }

    const userId = req.session.user._id;
    let user = await User.findById({ _id: userId });

    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    if (!user.favourites) {
        user.favourites = [];
    } else {
        user = await user.populate('favourites');
    }

    res.json({
        favouriteHomes: user.favourites,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user || null
    });
};

exports.AddToFavourites = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) {
        return res.status(401).json({ error: 'Please log in' });
    }
    const userId = req.session.user._id;
    const homeId = req.body.id;
    const user = await User.findById({ _id: userId });
    if (user.favourites.includes(homeId)) {
        return res.json({ message: 'Already in favourites' });
    }
    user.favourites.push(homeId);
    await user.save();
    res.json({ message: 'Added to favourites' });
};

exports.DeleteFromFavourites = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) {
        return res.status(401).json({ error: 'Please log in' });
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const homeId = req.params.homeId;
    user.favourites = user.favourites.filter(favouriteId => favouriteId.toString() !== homeId);
    await user.save();
    res.json({ message: 'Removed from favourites' });
};

exports.getRulesPdf = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ error: 'Please log in' });
    }
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);
    const rulesPdf = home.rulesPdf;
    const rulesPdfPath = path.join(rootDir, rulesPdf.replace('/uploads/', 'uploads/'));
    res.download(rulesPdfPath, 'Rules.pdf');
};

exports.searchHomes = async (req, res, next) => {
    try {
        const { location, checkin, checkout, guests } = req.query;
        let query = {};

        if (location && location.trim() !== '') {
            query.$or = [
                { location: { $regex: location, $options: 'i' } },
                { houseName: { $regex: location, $options: 'i' } },
                { description: { $regex: location, $options: 'i' } }
            ];
        }

        const registeredHomes = await Home.find(query);

        res.json({
            homes: registeredHomes,
            searchQuery: location || '',
            currentCategory: 'all',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};