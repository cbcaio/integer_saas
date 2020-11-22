const createApp = require('./application/app');

const port = 3000;

createApp().listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
