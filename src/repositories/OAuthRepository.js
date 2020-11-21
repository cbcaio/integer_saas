class OAuthRepository {
  constructor(args = {}) {
    const { queryBuilderOAuth, queryBuilderUser } = args;

    if (!queryBuilderOAuth || !queryBuilderUser) {
      throw new Error(
        'Repository requires a queryBuilderOAuth and a queryBuilderUser to work'
      );
    }

    this.queryBuilderOAuth = queryBuilderOAuth;
  }

  async getOAuthByAccessToken(bearerToken) {
    const oAuthInstance = await this.queryBuilderOAuth.getAccessToken(
      bearerToken
    );

    return oAuthInstance;
  }

  async getClient(clientId, clientSecret) {
    const oAuthClient = await this.queryBuilderOAuth.getClient(
      clientId,
      clientSecret
    );

    if (!oAuthClient) {
      return false;
    }

    return {
      client: {
        id: oAuthClient.client_id,
        grants: ['password']
      }
    };
  }

  async getUser(username, password) {
    const user = await this.queryBuilderUser.getUser(username, password);

    return user || false;
  }

  async saveToken(token, client, user) {
    return this.queryBuilderOAuth.saveAccessToken(token, client, user);
  }

  async getAccessToken(bearerToken) {
    const token = await this.queryBuilderOAuth.getAccessToken(bearerToken);

    return {
      accessToken: token.access_token,
      client: { id: token.client_id },
      expires: token.expires,
      user: { id: token.user_id }
    };
  }

  async getRefreshToken(bearerToken) {
    const token = await this.queryBuilderOAuth.getRefreshToken(bearerToken);

    if (!token) {
      return false;
    }

    return token;
  }
}

module.exports = OAuthRepository;
