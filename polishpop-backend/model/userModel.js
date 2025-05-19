
// polishpop-backend/models/userModel.js

const db = require('../database/knex');


const createUser = (userData) => {
  return db('users').insert(userData);
};

const findUserByEmail = (email) => {
  return db('users').where({ email }).first();
};

module.exports = {
  createUser,
  findUserByEmail,
};
