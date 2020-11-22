const { DateTime } = require('luxon');

module.exports = ({ oAuthRepository }) => {
  async function authenticateWithAccessToken(bearerToken) {
    const oAuthInstance = await oAuthRepository.getOAuthByAccessToken(
      bearerToken
    );

    if (!oAuthInstance) {
      throw new Error('Forbidden');
    }

    const now = DateTime.utc().valueOf();

    if (now > oAuthInstance.getAccessTokenExpiresAt()) {
      throw new Error('Access Token expired');
    }

    return oAuthInstance;
  }

  return {
    authenticateWithAccessToken
  };
};
