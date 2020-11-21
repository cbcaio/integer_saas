const { knexInstance } = require('../database');

const UserRepository = require('./UserRepository');
const UserRepositoryKnex = require('./UserRepositoryKnex');

const IdentifierRepository = require('./IdentifierRepository');
const IdentifierRepositoryKnex = require('./IdentifierRepositoryKnex');

const OAuthRepository = require('./OAuthRepository');
const OAuthRepositoryKnex = require('./OAuthRepositoryKnex');

const queryBuilderIdentifier = new IdentifierRepositoryKnex(knexInstance);
const queryBuilderUser = new UserRepositoryKnex(knexInstance);
const queryBuilderOAuth = new OAuthRepositoryKnex(knexInstance);

module.exports = {
  identifierRepository: new IdentifierRepository({
    queryBuilder: queryBuilderIdentifier
  }),
  userRepository: new UserRepository({ queryBuilder: queryBuilderUser }),
  oAuthRepository: new OAuthRepository({
    queryBuilderOAuth,
    queryBuilderUser
  })
};
