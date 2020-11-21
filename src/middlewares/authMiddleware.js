const { authenticateWithAccessToken } = require('../services');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const bearerToken = authorization.split(/Bearer\s+/g)[1];

    if (!bearerToken) {
      res.status(403).json({ message: 'No access token provided' });
      return;
    }

    const oAuthInstance = await authenticateWithAccessToken(bearerToken);

    req.authenticatedUser = {
      id: oAuthInstance.userId
    };

    next();
  } catch (e) {
    res.status(403).json({ message: 'Forbidden' });
  }
};
