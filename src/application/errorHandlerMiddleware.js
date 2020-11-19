module.exports = function errorHandlerMiddleware(err, req, res, next) {
  console.error(err.stack);
  res.status(400).json({ message: err.message });
};
