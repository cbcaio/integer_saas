const knex = require('knex');
const dbConfig = require('./config');

const knexInstance = knex(dbConfig);

module.exports = { knexInstance };
