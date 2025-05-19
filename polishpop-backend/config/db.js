
// polishpop-backend/config/db.js

const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',    // Your MySQL username
    password: '',    // Your MySQL password
    database: 'polishpop_db', // Your database name
  },
});

module.exports = db;
