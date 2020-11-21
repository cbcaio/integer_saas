class IdentifierRepository {
  constructor(args = {}) {
    const { queryBuilder, IdentifierModel } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;
    this.IdentifierModel = IdentifierModel;
  }

  makeIdentifier(args) {
    return new this.IdentifierModel(args);
  }

  async getIdentifierByUser(userId) {
    const identifierRaw = await this.queryBuilder.getIdentifierByUser(userId);

    if (!identifierRaw) {
      return false;
    }

    const identifierModel = new this.IdentifierModel({
      id: identifierRaw.id,
      userId: identifierRaw.user_id,
      currentIdentifier: identifierRaw.current
    });

    return identifierModel;
  }

  async saveIdentifier(identifierInstance) {
    if (identifierInstance.hasId()) {
      return this.queryBuilder.updateIdenfitier(identifierInstance);
    }

    const rawIdentifier = await this.queryBuilder.insertIdentifier(
      identifierInstance
    );

    return new this.IdentifierModel({
      id: rawIdentifier.id,
      userId: rawIdentifier.user_id,
      current: rawIdentifier.current
    });
  }
}

module.exports = IdentifierRepository;
