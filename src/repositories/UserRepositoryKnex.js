class UserRepositoryKnex {
  constructor(knexInstance) {
    if (!knexInstance) {
      throw new Error('Knex instance is not defined');
    }

    this.knex = knexInstance;

    this.primaryKey = 'id';
    this.userTable = 'users';
    this.accessTokensTable = 'oauth_tokens';
  }

  async registerUser(userInstance, oAuthTokenInstance) {
    return this.knex.transaction(async (trx) => {
      const [userId] = await trx.table(this.userTable).insert({
        username: userInstance.getUsername(),
        password: userInstance.getPassword()
      });

      const [tokenId] = await trx.table(this.accessTokensTable).insert({
        user_id: userId,
        client_id: oAuthTokenInstance.getClientId(),
        access_token: oAuthTokenInstance.getAccessToken(),
        access_token_expires_at: oAuthTokenInstance.getAccessTokenExpiresAt(),
        refresh_token: oAuthTokenInstance.getRefreshToken(),
        refresh_token_expires_at: oAuthTokenInstance.getRefreshTokenExpiresAt()
      });

      const token = await trx
        .table(this.accessTokensTable)
        .where('id', tokenId)
        .first();

      return {
        accessToken: token.access_token
      };
    });
  }

  async verifyUser(username, password) {
    const user = await this.knex
      .table(this.userTable)
      .select()
      .where('username', username)
      .andWhere('password', password)
      .first();

    return user || false;
  }

  async findUser(username) {
    const user = await this.knex
      .table(this.userTable)
      .where('username', username)
      .first();

    return user || false;
  }
}

module.exports = UserRepositoryKnex;
