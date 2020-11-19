const IdentifierModel = require('../domainModels/Identifier');
const User = require('../domainModels/User');

class IdentifierRepository {
  constructor(args = {}) {
    const { queryBuilder } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;
  }

  async getIdentifierByUser(user) {
    const userInstance = new User(user);

    const identifierRaw = await this.queryBuilder.findIdentifierByUser(
      userInstance
    );

    const identifierModel = new IdentifierModel(identifierRaw);

    return identifierModel;
  }

  async saveIdentifier(identifier) {
    const identifierModel = new IdentifierModel(identifier);

    if (identifier.hasId()) {
      return this.queryBuilder.updateIdenfitier(identifierModel);
    }

    return this.queryBuilder.insertIdentifier(identifier);
  }
}

module.exports = IdentifierRepository;
