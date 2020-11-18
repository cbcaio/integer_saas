const { DB_CONNECTION_STRING } = require('../envConfig');

const connectionParameters = {
  client: 'mysql',
  version: '5.7',
  debug: true,
  connection: DB_CONNECTION_STRING,
  migrations: {
    directory: `${__dirname}/../migrations`,
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: `${__dirname}/../seeds`
  }
};
module.exports = { connectionParameters };
