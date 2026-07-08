const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer to Cloudinary using a stream.
 * @param {Buffer} fileBuffer - The buffer of the file.
 * @param {string} folder - Destination folder on Cloudinary.
 * @param {string} resourceType - 'auto', 'image', 'raw', 'video'.
 * @returns {Promise<object>} The Cloudinary response object.
 */
const uploadToCloudinary = (fileBuffer, folder = 'staysphere', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes a file from Cloudinary based on its secure URL.
 * @param {string} fileUrl - The full Cloudinary URL.
 */
const deleteFromCloudinary = async (fileUrl) => {
  if (!fileUrl || !fileUrl.includes('res.cloudinary.com')) return;
  try {
    const parts = fileUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return;
    
    let filePart = parts.slice(uploadIndex + 1);
    // Remove the version segment (e.g. v1712345678) if it exists
    if (filePart[0] && filePart[0].startsWith('v') && !isNaN(filePart[0].substring(1))) {
      filePart = filePart.slice(1);
    }
    
    const publicIdWithExt = filePart.join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
    
    // Cloudinary separates raw files (PDFs etc) and images into different namespaces
    const isRaw = fileUrl.includes('/raw/upload/');
    const resourceType = isRaw ? 'raw' : 'image';
    
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
