const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');

// Setup untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route urutan sudah benar
router.get('/:userId', profileController.getProfile);
router.put('/:userId/change-password', profileController.changePassword);
router.put('/:userId', upload.single('foto_profil'), profileController.updateProfile);

module.exports = router;
