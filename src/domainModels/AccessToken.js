class AccessToken {
  constructor(args) {
    const { id, accessToken, userId = null } = args;

    AccessToken.isValidAccessToken(args);

    this.id = id;
    this.accessToken = accessToken;
    this.userId = userId;
  }

  static isValidAccessToken(args) {
    if (!args.accessToken) {
      throw new Error('AccessToken must have accessToken value');
    }
  }

  getId() {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id,
      accessToken: this.accessToken,
      userId: this.userId
    };
  }
}

module.exports = AccessToken;
