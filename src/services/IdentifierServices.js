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

  return {
    getCurrentUserIdenfifier,
    setCurrentUserIdenfifier
  };
};
