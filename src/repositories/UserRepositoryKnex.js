class UserRepositoryKnex {
  constructor(knexInstance) {
    if (!knexInstance) {
      throw new Error('Knex instance is not defined');
    }

    this.knex = knexInstance;

    this.primaryKey = 'id';
    this.userTable = 'users';
  }

  async insertUser(user) {
    const [userId] = await this.knex
      .table(this.userTable)
      .insert(user.toJSON());

    return userId;
  }

  async verifyUser(username, password) {
    return this.knex
      .table(this.userTable)
      .select()
      .where('username', username)
      .andWhere('password', password);
  }

  async findUser(username) {
    const user = await this.knex
      .table(this.userTable)
      .where('username', username)
      .first();

    return user;
  }
}

module.exports = UserRepositoryKnex;
