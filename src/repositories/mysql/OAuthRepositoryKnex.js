class OAuthRepositoryKnex {
  constructor(knexInstance) {
    if (!knexInstance) {
      throw new Error('Knex instance is not defined');
    }

    this.knex = knexInstance;

    this.tokensTable = 'oauth_tokens';
    this.clientsTable = 'oauth_clients';
  }

  async getAccessToken(bearerToken) {
    const token = await this.knex
      .table(this.tokensTable)
      .select([
        'id',
        'user_id',
        'client_id',
        'access_token',
        'access_token_expires_at',
        'refresh_token',
        'refresh_token_expires_at'
      ])
      .where('access_token', bearerToken)
      .first();

    if (!token) {
      return false;
    }

    return OAuthRepositoryKnex.formatToken(token);
  }

  async getClient(clientId, clientSecret) {
    const oAuthClient = await this.knex
      .table(this.clientsTable)
      .select(['client_id', 'client_secret', 'redirect_uri'])
      .where('client_id', clientId)
      .andWhere('client_secret', clientSecret)
      .first();

    if (!oAuthClient) {
      return false;
    }

    return {
      clientId: oAuthClient.client_id,
      clientSecret: oAuthClient.client_secret,
      grants: ['password']
    };
  }

  async getRefreshToken(bearerToken) {
    const token = await this.knex
      .table(this.tokensTable)
      .select([
        'id',
        'user_id',
        'client_id',
        'access_token',
        'access_token_expires_at',
        'refresh_token',
        'refresh_token_expires_at'
      ])
      .where('refresh_token', bearerToken)
      .first();

    if (!token) {
      return false;
    }

    return OAuthRepositoryKnex.formatToken(token);
  }

  async saveAccessToken(oAuthTokenInstance) {
    return this.knex
      .insert({
        access_token: oAuthTokenInstance.getAccessToken(),
        access_token_expires_at: oAuthTokenInstance.getAccessTokenExpiresAt(),
        client_id: oAuthTokenInstance.getClientId(),
        refresh_token: oAuthTokenInstance.getRefreshToken(),
        refresh_token_expires_at: oAuthTokenInstance.getRefreshTokenExpiresAt(),
        user_id: oAuthTokenInstance.getUserId()
      })
      .into(this.tokensTable);
  }

  static formatToken(queryResponse) {
    return {
      id: queryResponse.id,
      token: {
        accessToken: queryResponse.access_token,
        accessTokenExpiresAt: queryResponse.access_token_expires_at,
        refreshToken: queryResponse.refresh_token,
        refreshTokenExpiresAt: queryResponse.refresh_token_expires_at
      },
      client: {
        id: queryResponse.client_id
      },
      user: {
        id: queryResponse.user_id
      }
    };
  }
}

module.exports = OAuthRepositoryKnex;
