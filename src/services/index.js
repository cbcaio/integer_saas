const UserServices = require('./UserServices');

const { userRepository, oAuthRepository } = require('../repositories');

const userServices = UserServices({ userRepository, oAuthRepository });

module.exports = {
  registerUser: userServices.registerUser
};
