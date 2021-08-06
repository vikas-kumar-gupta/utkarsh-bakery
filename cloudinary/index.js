const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_KEY,
    api_secret: process.env.CLOUDNARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "UtkarshBakery",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
    cloudinary,
    storage
}