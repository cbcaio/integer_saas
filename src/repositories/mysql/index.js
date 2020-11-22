const { knexInstance } = require('./database');

const UserRepositoryKnex = require('./UserRepositoryKnex');
const IdentifierRepositoryKnex = require('./IdentifierRepositoryKnex');
const OAuthRepositoryKnex = require('./OAuthRepositoryKnex');

module.exports = {
  queryBuilderIdentifier: new IdentifierRepositoryKnex(knexInstance),
  queryBuilderUser: new UserRepositoryKnex(knexInstance),
  queryBuilderOAuth: new OAuthRepositoryKnex(knexInstance)
};
