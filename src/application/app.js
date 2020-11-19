const express = require('express');
const bodyParser = require('body-parser');

const resources = require('./resources');
const errorHandlerMiddleware = require('./errorHandlerMiddleware');

const app = express();

app.use(bodyParser.json());

app.use('/v1', [resources.registerResourceRouter]);

app.use('/v1', [resources.nextResourceRouter, resources.currentResourceRouter]);

app.use(errorHandlerMiddleware);

module.exports = app;
