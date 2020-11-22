class OAuthRepository {
  constructor(args = {}) {
    const { queryBuilderOAuth, queryBuilderUser, OAuthTokenModel } = args;

    if (!queryBuilderOAuth || !queryBuilderUser) {
      throw new Error(
        'Repository requires a queryBuilderOAuth and a queryBuilderUser to work'
      );
    }

    this.queryBuilderOAuth = queryBuilderOAuth;
    this.OAuthTokenModel = OAuthTokenModel;
  }

  makeOAuthToken(args) {
    return new this.OAuthTokenModel(args);
  }

  async getOAuthByAccessToken(bearerToken) {
    const token = await this.queryBuilderOAuth.getAccessToken(bearerToken);

    return this.makeOAuthToken(token);
  }
}

module.exports = OAuthRepository;
