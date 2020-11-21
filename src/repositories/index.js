const { knexInstance } = require('../database');

/* Domain Models */
const Identifier = require('../domainModels/Identifier');
const OAuthToken = require('../domainModels/OAuthToken');
const User = require('../domainModels/User');

/** */

/* Repositories */

const UserRepository = require('./UserRepository');
const UserRepositoryKnex = require('./UserRepositoryKnex');

const IdentifierRepository = require('./IdentifierRepository');
const IdentifierRepositoryKnex = require('./IdentifierRepositoryKnex');

const OAuthRepository = require('./OAuthRepository');
const OAuthRepositoryKnex = require('./OAuthRepositoryKnex');

/** */

const queryBuilderIdentifier = new IdentifierRepositoryKnex(knexInstance);
const queryBuilderUser = new UserRepositoryKnex(knexInstance);
const queryBuilderOAuth = new OAuthRepositoryKnex(knexInstance);

module.exports = {
  identifierRepository: new IdentifierRepository({
    queryBuilder: queryBuilderIdentifier,
    IdentifierModel: Identifier
  }),
  userRepository: new UserRepository({
    queryBuilder: queryBuilderUser,
    UserModel: User,
    OAuthTokenModel: OAuthToken
  }),
  oAuthRepository: new OAuthRepository({
    queryBuilderOAuth,
    queryBuilderUser
  })
};
