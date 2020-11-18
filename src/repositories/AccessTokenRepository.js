const AccessToken = require('../domainModels/AccessToken');

class AccessTokenRepository {
  constructor(args = {}) {
    const { queryBuilder } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;

    this.accessTokenTable = 'access_tokens';
    this.primaryKey = 'id';
  }

  async saveAccessToken(accessToken, userId) {
    const accessTokenInstance = new AccessToken({
      accessToken,
      userId
    });

    return this.queryBuilder
      .table(this.accessTokenTable)
      .insert(accessTokenInstance.toJSON());
  }

  async getUserIdFromBearerToken(bearerToken) {
    const accessTokens = await this.queryBuilder
      .table(this.accessTokenTable)
      .where('access_token', bearerToken)
      .first();

    return accessTokens.user_id;
  }
}

module.exports = AccessTokenRepository;
