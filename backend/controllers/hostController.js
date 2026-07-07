// CORE MODULES
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
// LOCAL MODULES
const Home = require('../models/home');
const rootDir = require('../utils/pathUtils');

exports.getAddHome = (req, res, next) => {
    res.json({ editing: false, isLoggedIn: req.isLoggedIn, user: req.session.user || null });
};

exports.postAddHome = (req, res, next) => {
    const { houseName, location, price, rating, description, category, amenities, reviews } = req.body;
    if (!req.files['photo']) {
        return res.status(400).json({ error: 'Photo is required' });
    }
    const photoPath = req.files.photo ? req.files.photo[0].path : null;
    const rulesPdfPath = req.files.rulesPdf ? req.files.rulesPdf[0].path : null;
    const photo = photoPath ? ('/' + photoPath).replace(/\\/g, '/') : null;
    const rulesPdf = rulesPdfPath ? ('/' + rulesPdfPath).replace(/\\/g, '/') : '';

    let parsedAmenities = [];
    let parsedReviews = [];
    try {
        if (amenities) parsedAmenities = JSON.parse(amenities);
        if (reviews) parsedReviews = JSON.parse(reviews);
    } catch (e) {
        console.error("Error parsing amenities/reviews", e);
    }

    const home = new Home({
        houseName, price, location, rating, photo, description, rulesPdf, category,
        amenities: parsedAmenities, reviews: parsedReviews
    });
    home.save()
        .then(() => {
            res.status(201).json({ message: 'Home added successfully' });
        })
        .catch(err => {
            console.log("cant add home", err);
            res.status(500).json({ error: 'Failed to add home' });
        });
};

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        if (!home) {
            return res.status(404).json({ error: 'Home not found' });
        }
        res.json({ home, editing: true, isLoggedIn: req.isLoggedIn, user: req.session.user || null });
    }).catch(next);
};

exports.postEditHome = async (req, res, next) => {
    const { houseName, location, price, rating, description, id, category, amenities, reviews } = req.body;
    try {
        const home = await Home.findById(id);
        if (!home) {
            return res.status(404).json({ error: 'Home not found' });
        }
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.description = description;
        if (category) home.category = category;

        if (amenities) {
            try {
                home.amenities = JSON.parse(amenities);
            } catch (e) {
                console.error("Error parsing amenities", e);
            }
        }
        if (reviews) {
            try {
                home.reviews = JSON.parse(reviews);
            } catch (e) {
                console.error("Error parsing reviews", e);
            }
        }

        if (req.files && req.files.photo && req.files.photo[0]) {
            const oldPath = path.join(rootDir, home.photo.replace('/uploads/', 'uploads/'));
            fs.unlink(oldPath, err => { if (err) console.log("error deleting file", err); });
            home.photo = '/uploads/images/' + req.files.photo[0].filename;
        }

        if (req.files && req.files.rulesPdf && req.files.rulesPdf[0]) {
            if (home.rulesPdf) {
                const oldPath = path.join(rootDir, home.rulesPdf.replace('/uploads/', 'uploads/'));
                fs.unlink(oldPath, err => { if (err) console.log("error deleting file", err); });
            }
            home.rulesPdf = '/uploads/pdfs/' + req.files.rulesPdf[0].filename;
        }

        await home.save();
        res.json({ message: 'Home updated successfully', home });
    } catch (err) {
        console.log("error while updating home", err);
        res.status(500).json({ error: 'Failed to update home' });
    }
};

exports.getHostHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.json({ homes: registeredHomes, isLoggedIn: req.isLoggedIn, user: req.session.user || null });
    }).catch(next);
};

exports.postDeleteHome = async (req, res, next) => {
    const homeId = req.params.homeId;
    try {
        const home = await Home.findById(homeId);
        if (!home) {
            return res.status(404).json({ error: 'Home not found' });
        }
        const oldPath = path.join(rootDir, home.photo.replace('/uploads/', 'uploads/'));
        fs.unlink(oldPath, err => { if (err) console.log("error while deleting file", err); });
        await Home.findOneAndDelete({ _id: homeId });
        res.json({ message: 'Home deleted successfully' });
    } catch (err) {
        console.log("cant delete from homes list", err);
        res.status(500).json({ error: 'Failed to delete home' });
    }
};