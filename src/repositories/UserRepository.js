const User = require('../domainModels/User');

class UserRepository {
  constructor(args = {}) {
    const { queryBuilder } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;

    this.userTable = 'users';
    this.identifierPrimaryKey = 'id';
  }

  async saveUser(user) {
    const userInstance = new User(user);

    return this.queryBuilder
      .table(this.userTable)
      .insert(userInstance.toJSON());
  }
}

module.exports = UserRepository;
