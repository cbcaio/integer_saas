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
    let rawIdentifier = null;

    rawIdentifier = identifierInstance.hasId()
      ? await this.queryBuilder.updateIdentifier(identifierInstance)
      : await this.queryBuilder.insertIdentifier(identifierInstance);

    return new this.IdentifierModel({
      id: rawIdentifier.id,
      userId: rawIdentifier.user_id,
      currentIdentifier: rawIdentifier.current
    });
  }

  async saveNextIdentifier(identifierInstance) {
    const rawIdentifier = await this.queryBuilder.saveNextIdentifier(
      identifierInstance
    );

    return new this.IdentifierModel({
      id: rawIdentifier.id,
      userId: rawIdentifier.user_id,
      currentIdentifier: rawIdentifier.current
    });
  }
}

module.exports = IdentifierRepository;
