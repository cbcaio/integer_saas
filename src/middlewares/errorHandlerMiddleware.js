module.exports = function errorHandlerMiddleware(err, req, res, next) {
  res.status(400).json({ message: err.message });
};
