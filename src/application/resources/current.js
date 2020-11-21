const express = require('express');

const router = express.Router();
const { identifierServices } = require('../../services');

router.get('/current', async (req, res) => {
  const userId = req.authenticatedUser.id;

  if (!userId) {
    res.status(403).json({ message: 'Not Authenticated' });
  }

  const currentIdentifier = await identifierServices.getCurrentUserIdenfifier(
    userId
  );

  res.status(200).json({ identifier: currentIdentifier });
});

router.put('/current', (req, res) => {
  res.send('current');
});

module.exports = router;
