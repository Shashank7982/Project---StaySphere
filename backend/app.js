// Import modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const path = require('path');
const dns = require('dns');
require('dotenv').config();

// LOCAL MODULES
const connectDB = require('./config/database');
const { storeRouter } = require('./routes/storeRouter');
const { hostRouter } = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter');
const rootDir = require('./utils/pathUtils');
const errorController = require('./controllers/errors');

// Fix for MongoDB Atlas connection issue in some networks
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
    console.warn("DNS setServers failed:", err.message);
}
const DB_PATH = process.env.MONGO_URL;

// creating session store
const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.error('Session Store Error:', error);
});

// creating app
const app = express();

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for development and production
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Multer storage configuration using Memory Storage
const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
    if (file.fieldname === 'photo') {
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    } else {
        if (file.fieldname === 'rulesPdf' && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
};

const multerOptions = { storage, fileFilter };
app.use(multer(multerOptions).fields([{ name: 'photo', maxCount: 1 }, { name: 'rulesPdf', maxCount: 1 }]));

// Serve uploads and public folders
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(express.static(path.join(rootDir, 'public')));

// Serve React build in production
const frontendBuildPath = path.join(rootDir, '..', 'frontend', 'dist');
app.use(express.static(frontendBuildPath));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Middleware for accessing session data
app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    req.user = req.session.user;
    next();
});

// API Routes — all prefixed with /api
app.use("/api/auth", authRouter);
app.use("/api/store", storeRouter);

// Auth middleware for protected API routes (only applies to host paths)
app.use("/api/host", (req, res, next) => {
    if (req.isLoggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
});

app.use("/api/host", hostRouter);

// Unknown API route handling
app.use('/api/{*path}', errorController.pageNotFound);

// Serve React app for all non-API routes (SPA fallback)
app.get('/{*path}', (req, res) => {
    const indexPath = path.join(frontendBuildPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // During development, React is served by Vite
            res.status(404).json({ error: 'Frontend not built. Run: cd frontend && npm run build' });
        }
    });
});

// Starting server
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 API Server running at http://localhost:${PORT}/api`);
            console.log(`📦 React frontend: run 'cd frontend && npm run dev' on port 5173`);
        });
    });
} else {
    connectDB();
}

module.exports = app;
