/* eslint-disable no-await-in-loop */
module.exports = ({ identifierRepository }) => {
  async function getCurrentUserIdenfifier(userId) {
    let identifier = await identifierRepository.getIdentifierByUser(userId);

    if (!identifier) {
      const newIdentifier = identifierRepository.makeIdentifier({ userId });

      identifier = await identifierRepository.saveIdentifier(newIdentifier);
    }

    return identifier.getCurrentIdentifier();
  }

  async function setCurrentUserIdenfifier(userId, identifierValue) {
    const existentIdentifier = await identifierRepository.getIdentifierByUser(
      userId
    );

    const newIdentifierInstance = identifierRepository.makeIdentifier({
      id: existentIdentifier ? existentIdentifier.getId() : null,
      userId,
      currentIdentifier: identifierValue
    });

    const identifier = await identifierRepository.saveIdentifier(
      newIdentifierInstance
    );

    return identifier.getCurrentIdentifier();
  }

  async function getNextIdentifier(userId) {
    let updatedIdentifier = null;

    const maxRetries = 2;
    for (
      let attemptCounter = 0;
      attemptCounter < maxRetries;
      attemptCounter += 1
    ) {
      try {
        const identifier = await identifierRepository.getIdentifierByUser(
          userId
        );

        updatedIdentifier = await identifierRepository.saveNextIdentifier(
          identifier
        );

        break;
      } catch (e) {
        if (attemptCounter === maxRetries) {
          throw e;
        }
      }
    }

    return updatedIdentifier.getCurrentIdentifier();
  }

  return {
    getCurrentUserIdenfifier,
    setCurrentUserIdenfifier,
    getNextIdentifier
  };
};
