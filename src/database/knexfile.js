const { DB_CONNECTION_STRING } = require('../envConfig');

const connectionParameters = {
  client: 'mysql',
  version: '5.7',
  connection: DB_CONNECTION_STRING
};

module.exports = {
  development: {
    ...connectionParameters,
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    ...connectionParameters,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    ...connectionParameters,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
