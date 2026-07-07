# StaySphere 🏠

A modern, full-stack property rental platform built with Node.js, Express, MongoDB, and TailwindCSS. StaySphere offers a beautiful, Airbnb-inspired interface with server-side rendering for optimal performance.

---

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with bcrypt password hashing
- 👥 **Dual User Roles** - Separate interfaces for Guests and Hosts
- 🏡 **Property Listings** - Browse 60+ beautiful properties worldwide
- ❤️ **Favorites System** - Save and manage your favorite properties
- 📸 **Image Upload** - Hosts can upload property photos with Multer
- 🎨 **Modern UI** - Clean, responsive design with TailwindCSS
- 🔄 **Server-Side Rendering** - Fast page loads with EJS templates
- 💾 **Session Management** - Persistent user sessions with MongoDB

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/staysphere.git
cd staysphere
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
MONGO_URL=mongodb://localhost:27017/staysphere
SESSION_SECRET=your-secret-key-change-this-in-production
PORT=3000
```

4. **Seed the database** (Optional - adds 60 sample properties)
```bash
npm run seed
```

5. **Run the application**

For development (with auto-reload and Tailwind watch):
```bash
npm run dev
```

For production:
```bash
npm start
```

Visit `http://localhost:3000/store` to see your app! 🎉

---

## 📁 Project Structure

```
staysphere/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── config/
│   ├── database.js        # MongoDB connection
│   └── seedDatabase.js    # Database seeding script
├── controllers/           # Route logic and business logic
│   ├── authController.js
│   ├── storeController.js
│   └── hostController.js
├── models/                # MongoDB schemas
│   ├── home.js
│   ├── user.js
│   └── favourites.js
├── routes/                # Express routes
│   ├── authRouter.js
│   ├── storeRouter.js
│   └── hostRouter.js
├── views/                 # EJS templates
│   ├── partials/          # Reusable components
│   ├── store/             # Guest-facing pages
│   ├── host/              # Host dashboard pages
│   └── auth/              # Login/signup pages
├── public/                # Static assets
│   └── output.css         # Compiled Tailwind CSS
└── uploads/               # User-uploaded files
    ├── images/
    └── pdfs/
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **express-validator** - Input validation
- **Multer** - File upload handling

### Frontend
- **EJS** - Server-side templating
- **TailwindCSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Client-side interactions

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the app in production mode |
| `npm run dev` | Run with nodemon + Tailwind watch |
| `npm run serve` | Run server with nodemon |
| `npm run tailwind` | Watch and compile Tailwind CSS |
| `npm run build` | Build production CSS |
| `npm run seed` | Populate database with sample data |

---

## 🔐 Sample Accounts

After running the seed script, you can login with:

**Guest Account:**
- Email: `guest@example.com`
- Password: `password123`

**Host Account:**
- Email: `host@example.com`
- Password: `password123`

---

## 🌟 Key Features Breakdown

### For Guests
- Browse property listings with beautiful images
- Filter properties by category
- View detailed property information
- Save favorite properties
- Manage bookings (coming soon)

### For Hosts
- Add new property listings
- Upload property photos and documents
- Edit existing listings
- Manage property availability
- View booking requests (coming soon)

---

## 🎨 Design Philosophy

StaySphere follows modern web design principles:
- **Clean & Minimal** - Uncluttered interface focusing on content
- **Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Accessible** - Semantic HTML and ARIA labels
- **Fast** - Server-side rendering for optimal performance
- **Consistent** - Unified design system with reusable components

---

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- Session-based authentication
- CSRF protection ready
- Input validation and sanitization
- Secure file upload with type checking
- Environment variable protection

---

## 🚧 Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Real-time booking system
- [ ] Review and rating system
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Inspired by Airbnb's design and user experience
- Built as a learning project to master full-stack development
- Thanks to the open-source community for amazing tools and libraries

---

## 📧 Contact

For questions or feedback, please reach out:
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

**Made with ❤️ and lots of ☕**
