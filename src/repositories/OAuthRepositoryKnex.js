const OAuthToken = require('../domainModels/OAuthToken');

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

    return new OAuthToken({
      id: token.id,
      token: {
        accessToken: token.access_token,
        accessTokenExpiresAt: token.access_token_expires_at,
        refreshToken: token.refresh_token,
        refreshTokenExpiresAt: token.refresh_token_expires_at
      },
      client: {
        id: token.client_id
      },

      user: {
        id: token.user_id
      }
    });
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
        'access_token',
        'access_token_expires_at',
        'client_id',
        'refresh_token',
        'refresh_token_expires_at',
        'user_id'
      ])
      .where('refresh_token', bearerToken)
      .first();

    if (!token) {
      return false;
    }

    return token;
  }

  async saveAccessToken(token, client, user) {
    const oAuthToken = new OAuthToken({
      token,
      client,
      user
    });

    return this.knex
      .insert({
        access_token: oAuthToken.getAccessToken(),
        access_token_expires_at: oAuthToken.getAccessTokenExpiresAt(),
        client_id: oAuthToken.getClientId(),
        refresh_token: oAuthToken.getRefreshToken(),
        refresh_token_expires_at: oAuthToken.getRefreshTokenExpiresAt(),
        user_id: oAuthToken.getUserId()
      })
      .into(this.tokensTable);
  }
}

module.exports = OAuthRepositoryKnex;
