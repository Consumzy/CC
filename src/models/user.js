// src/models/user.js
const knex = require('../database/knex');
const bcrypt = require('bcrypt');

class User {
  async findByEmail(email) {
    return await knex('Users').where('email', email).first();
  }

  async findByToken(token) {
    return await knex('Users').where('token', token).first();
  }

  async createUser(email, password, name) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await knex('Users').insert({
      email: email,
      password: hashedPassword,
      name: name,
    });
  }  

  async updateToken(email, token) {
    return await knex('Users').where('email', email).update({ token: token });
  }
  
}

module.exports = User;