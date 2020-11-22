const knex = require('knex');
const knexfile = require('./knexfile');

const knexInstance = knex(knexfile.staging);

module.exports = { knexInstance };
