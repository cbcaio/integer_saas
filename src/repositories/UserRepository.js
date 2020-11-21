class UserRepository {
  constructor(args = {}) {
    const { queryBuilder } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;
  }

  async registerUser(userInstance, oAuthTokenInstance) {
    const userId = await this.queryBuilder.registerUser(
      userInstance,
      oAuthTokenInstance
    );

    return userId;
  }

  async getUser(username, password) {
    return this.queryBuilder.verifyUser(username, password);
  }

  async isValidUser(userInstance) {
    const user = await this.queryBuilder.findUser(userInstance.username);

    return !!user;
  }
}

module.exports = UserRepository;
