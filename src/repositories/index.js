const { knexInstance } = require('../database');

const UserRepository = require('./UserRepository');
const UserRepositoryKnex = require('./UserRepositoryKnex');

const IdentifierRepository = require('./IdentifierRepository');
const IdentifierRepositoryKnex = require('./IdentifierRepositoryKnex');

const queryBuilderIdentifier = new IdentifierRepositoryKnex(knexInstance);
const queryBuilderUser = new UserRepositoryKnex(knexInstance);

module.exports = {
  identifierRepository: new IdentifierRepository({
    queryBuilder: queryBuilderIdentifier
  }),
  userRepository: new UserRepository({ queryBuilder: queryBuilderUser })
};
