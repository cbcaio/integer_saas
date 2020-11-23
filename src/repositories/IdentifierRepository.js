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
    const identifier = await this.queryBuilder.getIdentifierByUser(userId);

    if (!identifier) {
      const newIdentifier = this.makeIdentifier({ userId });

      return this.saveIdentifier(newIdentifier);
    }

    const identifierModel = new this.IdentifierModel({ ...identifier });

    return identifierModel;
  }

  async saveIdentifier(identifierInstance) {
    let identifier = null;

    identifier = identifierInstance.hasId()
      ? await this.queryBuilder.updateIdentifier(identifierInstance)
      : await this.queryBuilder.insertIdentifier(identifierInstance);

    return new this.IdentifierModel({
      ...identifier
    });
  }

  async saveNextIdentifier(identifierInstance) {
    const identifier = await this.queryBuilder.saveNextIdentifier(
      identifierInstance
    );

    return new this.IdentifierModel({
      ...identifier
    });
  }
}

module.exports = IdentifierRepository;
