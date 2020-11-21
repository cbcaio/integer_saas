const express = require('express');

const router = express.Router();
const { identifierServices } = require('../../services');

router.get('/current', async (req, res) => {
  const userId = req.authenticatedUser.id;

  const currentIdentifier = await identifierServices.getCurrentUserIdenfifier(
    userId
  );

  res.status(200).json({ identifier: currentIdentifier });
});

router.put('/current', async (req, res) => {
  const userId = req.authenticatedUser.id;
  const { current } = req.body;

  const currentIdentifier = await identifierServices.setCurrentUserIdenfifier(
    userId,
    current
  );

  res.status(200).json({ identifier: currentIdentifier });
});

module.exports = router;
