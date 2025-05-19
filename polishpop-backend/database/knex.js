
// database/knex.js

const knex = require('knex');

const db = knex({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root', // default user in XAMPP
        password: '', // your MySQL password, usually empty in XAMPP
        database: 'polishpop_db' // you will create this database in phpMyAdmin
    }
});

module.exports = db;
