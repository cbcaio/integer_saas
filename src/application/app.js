const express = require('express');
const resources = require('./resources');

const app = express();

app.use('/v1', [resources.nextResourceRouter, resources.currentResourceRouter]);

module.exports = app;
