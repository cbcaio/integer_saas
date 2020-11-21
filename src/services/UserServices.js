const User = require('../domainModels/User');
const OAuthToken = require('../domainModels/OAuthToken');

module.exports = ({ userRepository }) => {
  async function registerUser(username, password) {
    const newUser = new User({
      username,
      password
    });

    const userExists = await userRepository.isValidUser(newUser);

    if (userExists) {
      throw new Error('User already exists');
    }

    const secondsInOneDay = 86400;
    const accessToken = new OAuthToken({ expiresIn: secondsInOneDay });
    const result = await userRepository.registerUser(newUser, accessToken);

    return {
      accessToken: result.accessToken
    };
  }

  return {
    registerUser
  };
};
