const User = require('../domainModels/User');

class UserRepository {
  constructor(args = {}) {
    const { queryBuilder } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;

    this.userTable = 'users';
    this.primaryKey = 'id';
  }

  async saveUser(user) {
    const userInstance = new User(user);

    return this.queryBuilder
      .table(this.userTable)
      .insert(userInstance.toJSON());
  }

  async getUser(username, password) {
    return this.queryBuilder
      .table(this.userTable)
      .select()
      .where('username', username)
      .andWhere('password', password);
  }

  async isValidUser(username) {
    const users = await this.queryBuilder
      .table(this.userTable)
      .select()
      .where('username', username);

    return users.length > 0;
  }
}

module.exports = UserRepository;
