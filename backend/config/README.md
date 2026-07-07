# Database Configuration

This folder contains database-related configuration files.

## Files

- **database.js** - MongoDB connection configuration using Mongoose

## Environment Variables Required

Make sure to set the following in your `.env` file:
- `MONGO_URL` - MongoDB connection string (e.g., `mongodb://localhost:27017/airbnb-clone`)
- `SESSION_SECRET` - Secret key for session management
- `PORT` - Server port (optional, defaults to 3000)
