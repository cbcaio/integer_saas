const serverless = require('serverless-http');
const createApp = require('../application/app');

async function handler(event, context) {
  const app = await createApp();

  const lambdaExecution = serverless(app);

  const result = await lambdaExecution(event, context);

  return result;
}

module.exports = {
  handler
};
