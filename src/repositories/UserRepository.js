const User = require('../domainModels/User');

class UserRepository {
  constructor(args = {}) {
    const { queryBuilder } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;
  }

  async saveUser(user) {
    const userInstance = new User(user);

    const userId = await this.queryBuilder.insertUser(userInstance);

    return userId;
  }

  async getUser(username, password) {
    return this.queryBuilder.verifyUser(username, password);
  }

  async isValidUser(username) {
    const user = await this.queryBuilder.findUser(username);

    return !!user;
  }
}

module.exports = UserRepository;
