const IdentifierModel = require('../domainModels/Identifier');
const User = require('../domainModels/User');

class IdentifierRepository {
  constructor(args = {}) {
    const { queryBuilder } = args;

    if (!queryBuilder) {
      throw new Error('Repository requires a queryBuilder to work');
    }

    this.queryBuilder = queryBuilder;

    this.identifierTable = 'user_identifier';
    this.primaryKey = 'id';
    this.identifierCurrentValueColumn = 'current';
    this.userForeignKey = 'user_id';
  }

  async getIdentifierByUser(user) {
    const userModel = new User(user);

    const identifierRaw = await this.queryBuilder
      .select()
      .from(this.identifierTable)
      .where(this.userForeignKey, userModel.getId());

    const identifierModel = new IdentifierModel(identifierRaw);

    return identifierModel;
  }

  async saveIdentifier(identifier) {
    const identifierModel = new IdentifierModel(identifier);

    if (identifier.hasId()) {
      return this.queryBuilder
        .table(this.identifierTable)
        .where(this.primaryKey, identifierModel.getId())
        .update(
          this.identifierCurrentValueColumn,
          identifierModel.getCurrentIdentifier()
        );
    }

    return this.queryBuilder
      .insert(identifierModel.toJSON())
      .into(this.identifierTable);
  }
}

module.exports = IdentifierRepository;
