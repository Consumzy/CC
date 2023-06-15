// src/app.js
const express = require('express');
const app = express();
const multer = require('multer');

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

app.use(express.json());

app.use(authRoutes);
app.use(dataRoutes);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});