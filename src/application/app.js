const express = require('express');
const bodyParser = require('body-parser');

const resources = require('./resources');
const errorHandlerMiddleware = require('../middlewares/errorHandlerMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', resources.registerResourceRouter);

app.use(authMiddleware);
app.use('/v1', [resources.nextResourceRouter, resources.currentResourceRouter]);

app.use(errorHandlerMiddleware);

module.exports = app;
