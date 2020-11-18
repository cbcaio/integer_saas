const express = require('express');

const router = express.Router();

router.get('/current', (req, res) => {
  res.send('current');
});

router.put('/current', (req, res) => {
  res.send('current');
});

module.exports = router;
