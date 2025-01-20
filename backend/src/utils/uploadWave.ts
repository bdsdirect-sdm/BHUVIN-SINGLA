import multer from 'multer';
import path from 'path';

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(ext === '.jpeg' || ext === '.jpg' || ext === '.png')
    {
      cb(null, 'uploads/waves/images/');
    } else {
        cb(null, 'uploads/waves/videos/');
    }
     // Specify the directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    // Create a unique filename for each file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Preserve original file extension
  }
});

// Create an upload instance with file size limit and allowed file types
export const uploadWave = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|png|jpg|mp4|avi|mov/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File type not allowed!'));
  }
});
