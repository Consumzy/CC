// src/controllers/authController.js
const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const knex = require('../database/knex');

const user = new User();

async function register(req, res) {
  try {
    // Validate the request body using Joi
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the username is already taken
    const existingUser = await user.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Insert the user into the database
    await knex('Users').insert({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    // Validate the request body using Joi
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Retrieve the user from the database
    const userRecord = await user.findByEmail(req.body.email);
    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the password with the stored hash
    const passwordMatch = await bcrypt.compare(req.body.password, userRecord.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a unique token using UUID
    const token = uuidv4();

    // Update the user's token in the database
    await user.updateToken(req.body.email, token);

    return res.status(200).json({ message: 'Login berhasil', token: token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
};