module.exports = ({ identifierRepository }) => {
  async function getCurrentUserIdenfifier(userId) {
    let identifier = await identifierRepository.getIdentifierByUser(userId);

    if (!identifier) {
      const newIdentifier = identifierRepository.makeIdentifier({ userId });

      identifier = await identifierRepository.saveIdentifier(newIdentifier);
    }

    return identifier.getCurrentIdentifier();
  }

  return {
    getCurrentUserIdenfifier
  };
};
