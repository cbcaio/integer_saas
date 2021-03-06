const express = require('express');
const bodyParser = require('body-parser');

const resources = require('./resources');
const errorHandlerMiddleware = require('../middlewares/errorHandlerMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = function createApp() {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/auth', resources.registerResourceRouter);

  app.use(authMiddleware);
  app.use('/', [resources.nextResourceRouter, resources.currentResourceRouter]);

  app.use(errorHandlerMiddleware);

  return app;
};
