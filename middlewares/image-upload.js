const multer = require('multer');
const uuid = require('uuid').v4;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME ,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });
 
 const generateFilename = (req, file) => {
    return uuid() + '-' + file.originalname;
  };
 
 const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
       folder: 'new-folder-mf',
       // format: async (req, file) => 'png', // supports promises as well
       filename: generateFilename, 
       // public_id: (req, file) => 'computed-filename-using-requests',
    },
 });
 
 const parser = multer({ storage: storage });



const configuredMulterMiddleware = parser.single('image');

module.exports = configuredMulterMiddleware;