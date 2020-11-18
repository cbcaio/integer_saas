const { knexInstance } = require('../database');

const IdentifierRepository = require('./IdentifierRepository');
const UserRepository = require('./UserRepository');

module.exports = {
  identifierRepository: new IdentifierRepository({
    queryBuilder: knexInstance
  }),
  userRepository: new UserRepository({ queryBuilder: knexInstance })
};
