// src/routes/dataRoutes.js
const express = require('express');
const multer = require('multer');
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/data', authMiddleware, dataController.getData);
router.post('/data', authMiddleware, dataController.createData);
router.get('/data/category/:category', authMiddleware, dataController.getDataByCategory);
router.post('/data/photo/:foodId', authMiddleware, upload.single('photo'), dataController.uploadPhoto);

module.exports = router;