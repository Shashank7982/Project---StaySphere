# Simplified Cloudinary Upload Guide

This guide explains how files are uploaded to Cloudinary in simple, easy-to-understand terms.

---

## ☁️ Concept: How it works
1. **Frontend** sends a file (Image or PDF) to the server.
2. **Multer** catches the file and holds it in the server's temporary memory (as a "Buffer").
3. **Cloudinary SDK** takes that memory buffer and uploads it directly to the cloud.
4. **Cloudinary** returns a secure URL (e.g. `https://res.cloudinary.com/...`).
5. **MongoDB** saves this URL as a simple string.

---

## 🛠️ The 3 Main Code Blocks

### 1. Cloudinary Configuration & Helper
**File**: `backend/config/cloudinary.js`
This file connects to Cloudinary using your environment keys and exports two simple functions: `uploadToCloudinary` and `deleteFromCloudinary`.

```javascript
const cloudinary = require('cloudinary').v2;

// 1. Connect to Cloudinary using keys from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Upload file memory (Buffer) to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    // Open a stream to stream the file to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); // Returns the result containing .secure_url
      }
    );
    stream.end(fileBuffer); // Write the file buffer to the stream
  });
};

// 3. Delete file from Cloudinary using its URL
const deleteFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    // Extract the public ID from the URL string
    const parts = fileUrl.split('/');
    const publicIdWithExtension = parts[parts.length - 1]; // e.g. "my-image.jpg"
    const publicId = publicIdWithExtension.split('.')[0]; // e.g. "my-image"
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
```

---

### 2. Multer Memory Setup
**File**: `backend/app.js`
Instructs Multer to hold files in memory instead of saving them onto the server's hard drive.

```javascript
// Keep files in memory (as Buffers)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Receive 'photo' and 'rulesPdf' fields
app.use(upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'rulesPdf', maxCount: 1 }
]));
```

---

### 3. Controller Usage
**File**: `backend/controllers/hostController.js`
Where we trigger the uploads and save the returned URLs to the Database.

```javascript
// Adding a listing
exports.postAddHome = async (req, res) => {
  let photoUrl = '';
  
  // If user uploaded a photo, upload it to Cloudinary
  if (req.files.photo) {
    const result = await uploadToCloudinary(req.files.photo[0].buffer, 'photos', 'image');
    photoUrl = result.secure_url; // This is the URL we save to MongoDB
  }
  
  // Save photoUrl to Database...
};

// Deleting a listing
exports.postDeleteHome = async (req, res) => {
  const home = await Home.findById(req.params.homeId);
  
  // Delete the image from Cloudinary before deleting database record
  await deleteFromCloudinary(home.photo);
  
  await Home.findByIdAndDelete(req.params.homeId);
};
```
