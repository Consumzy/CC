// src/controllers/dataController.js
const fs = require('fs');
const Joi = require('joi');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const knex = require('../database/knex');
const { Storage } = require('@google-cloud/storage');

const user = new User();
const storage = new Storage({
  keyFilename: 'src/serviceAccount.json',
  projectId: 'consumzy-project',
});

async function getData(req, res) {
  try {
    const token = req.headers.email;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRecord = await user.findByToken(token);
    if (!userRecord) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = await knex('FoodMaterials').where('email', userRecord.email).select('*');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function createData(req, res) {
  try {
    const token = req.headers.email;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRecord = await user.findByToken(token);
    if (!userRecord) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const schema = Joi.object({
      month: Joi.number().integer().required(),
      year: Joi.number().integer().required(),
      quantity: Joi.number().required(),
      purchase_date: Joi.date().required(),
      category: Joi.string().valid('fruit', 'meat', 'vegetable').required(),
    }).options({ allowUnknown: true });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const insertedData = await knex('FoodMaterials').insert({
      month: req.body.month,
      year: req.body.year,
      email: userRecord.email,
      quantity: req.body.quantity,
      purchase_date: req.body.purchase_date,
      category: req.body.category,
    });

    const foodId = insertedData[0]; // Mendapatkan food_id dari hasil operasi insert

    return res.status(201).json({ message: 'Data created successfully', food_id: foodId });
  } catch (error) {
    console.error('Error creating data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getDataByCategory(req, res) {
  try {
    const token = req.headers.email;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRecord = await user.findByToken(token);
    if (!userRecord) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const category = req.params.category;
    const data = await knex('FoodMaterials')
      .where('email', userRecord.email)
      .where('category', category)
      .select('*');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data by category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function uploadPhoto(req, res) {
  try {
    const token = req.headers.email;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRecord = await user.findByToken(token);
    if (!userRecord) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const foodId = req.params.foodId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucketName = 'scan-upload-image'; // Ganti dengan nama bucket Google Cloud Storage Anda
    const filename = `${uuidv4()}_${file.originalname}`;
    const photoUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    const bucket = storage.bucket(bucketName);
    const fileOptions = {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    };

    await bucket.upload(file.path, {
      destination: filename,
      ...fileOptions,
    });

    // Hapus file dari folder lokal setelah mengunggahnya
    fs.unlinkSync(file.path);

    // Update photo_url in database
    await knex('FoodMaterials')
      .where('food_id', foodId)
      .update({ photo_url: photoUrl });

    return res.status(200).json({ message: 'Photo uploaded successfully', photo_url: photoUrl });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = {
  getData,
  createData,
  getDataByCategory,
  uploadPhoto,
};