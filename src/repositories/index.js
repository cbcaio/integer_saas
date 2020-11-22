/* Domain Models */
const Identifier = require('../domainModels/Identifier');
const OAuthToken = require('../domainModels/OAuthToken');
const User = require('../domainModels/User');

/* Repositories */
const UserRepository = require('./UserRepository');
const IdentifierRepository = require('./IdentifierRepository');
const OAuthRepository = require('./OAuthRepository');

/* Repositories */
const {
  queryBuilderIdentifier,
  queryBuilderOAuth,
  queryBuilderUser
} = require('./mysql');

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
    queryBuilderUser,
    OAuthTokenModel: OAuthToken
  })
};
