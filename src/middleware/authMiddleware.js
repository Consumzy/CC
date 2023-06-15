// src/middleware/authMiddleware.js
const User = require('../models/user');
const knex = require('../database/knex');

const user = new User();

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.email;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized token' });
    }

    const userRecord = await user.findByToken(token);
    if (!userRecord) {
      return res.status(401).json({ error: 'Unauthorized Token' });
    }

    req.user = userRecord;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = authMiddleware;