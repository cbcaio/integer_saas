const crypto = require('crypto');
const { DateTime } = require('luxon');

class OAuthToken {
  constructor(args = {}) {
    const { id = null, token = {}, client = {}, user = {}, expiresIn } = args;

    this.id = id;
    this.userId = user.id;
    this.clientId = client.id;
    this.accessToken = token.accessToken || OAuthToken.generateToken();
    this.accessTokenExpiresAt =
      token.accessTokenExpiresAt ||
      OAuthToken.generateExpirationDate(expiresIn);
    this.refreshToken = token.refreshToken;
    this.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
  }

  static generateToken() {
    const token = crypto.randomBytes(20).toString('hex');

    return token;
  }

  static generateExpirationDate(seconds = 0) {
    return DateTime.utc().plus({ seconds }).toString();
  }

  getUserId() {
    return this.userId;
  }

  getClientId() {
    return this.clientId;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getAccessTokenExpiresAt() {
    return this.accessTokenExpiresAt;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getRefreshTokenExpiresAt() {
    return this.refreshTokenExpiresAt;
  }
}

module.exports = OAuthToken;
