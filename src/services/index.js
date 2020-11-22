const UserServices = require('./UserServices');
const AuthenticationServices = require('./AuthenticationServices');
const IdentifierServices = require('./IdentifierServices');

const {
  userRepository,
  oAuthRepository,
  identifierRepository
} = require('../repositories');

const userServices = UserServices({ userRepository });
const authenticationServices = AuthenticationServices({ oAuthRepository });
const identifierServices = IdentifierServices({ identifierRepository });

module.exports = {
  registerUser: userServices.registerUser,
  authenticateWithAccessToken:
    authenticationServices.authenticateWithAccessToken,
  identifierServices
};
