# StaySphere 🏡

StaySphere is a premium, full-stack rental booking platform designed to connect hosts and guests. The application is built using a modern **React (Vite)** frontend and a **Node.js / Express** backend, featuring image and document upload integration via **Cloudinary**, and hosted serverlessly on **Vercel** with a unified single-domain setup.

---

## 🚀 Key Features

* **Secure Authentication**: Session-based login and registration featuring encrypted passwords (bcryptjs) and automatic cross-origin cookies.
* **Property Listings**: Multi-category property filtering (Beachfront, Cabins, Amazing Views, Last Minute, etc.).
* **Media Uploads**: Dynamic hosting of listing photos and house rule PDFs using memory-buffered **Cloudinary API** uploads.
* **Booking & Reviews**: Real-time room booking calculations and guest review systems.
* **First-Party Cookies**: Configured behind Vercel reverse-proxies to prevent Chrome/Safari third-party cookie blocking.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React.js, JavaScript (ES6+), Vite
* **Styling**: Vanilla CSS (Tailwind CSS custom components)
* **API Calls**: Axios (pre-configured with `withCredentials: true` for sessions)

### Backend
* **Runtime**: Node.js, Express.js
* **Database**: MongoDB Atlas, Mongoose ODM
* **Session Store**: MongoDB Session Store (`connect-mongodb-session`)
* **Storage & Uploads**: Multer (Memory Storage) & Cloudinary SDK

### Deployment
* **Platform**: Vercel (Unified Monorepo Routing)

---

## 📁 Directory Structure

```
├── api/                  # Vercel serverless API entry point (index.js)
├── backend/              # Node.js / Express API server logic
│   ├── config/           # Database config & Cloudinary configurations
│   ├── controllers/      # MVC controllers (Auth, Home, Host, Booking)
│   ├── models/           # Mongoose schemas (User, Home, Booking)
│   └── app.js            # Express application setup
├── frontend/             # Vite + React client application
│   ├── src/
│   │   ├── api/          # Axios instance configuration
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React Authentication Context
│   │   └── pages/        # Router pages (Login, Register, Home, Listing)
└── vercel.json           # Unified production routing configuration
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `backend/` directory (and add these variables to your Vercel Project Settings):

```env
MONGO_URL=mongodb+srv://...           # MongoDB Connection String
SESSION_SECRET=your_session_secret    # Express Session encryption secret key
PORT=3000                             # Local API port
CLOUDINARY_CLOUD_NAME=your_cloud_name # Cloudinary Cloud Name
CLOUDINARY_API_KEY=your_api_key       # Cloudinary API Key
CLOUDINARY_API_SECRET=your_api_secret # Cloudinary Secret
```

---

## 💻 Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Shashank7982/Project---StaySphere.git
   cd Project---StaySphere
   ```

2. **Set up the Backend**:
   ```bash
   cd backend
   npm install
   # Create your .env file
   node config/seedDatabase.js   # Seeds database with 150 properties
   npm start
   ```

3. **Set up the Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🌍 Vercel Production Deployment

To host this project on Vercel under a **single domain** (avoiding cross-origin cookie issues):

1. Import the root of the repository (`Project---StaySphere`) into Vercel.
2. Select **Other** as the Framework Preset (keep the Root Directory as `./`).
3. Add the environment variables (`MONGO_URL`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) in Vercel settings.
4. Click **Deploy**. Vercel will automatically compile the frontend assets and route all `/api/*` traffic to the serverless Express backend.
