class IdentifierRepositoryKnex {
  constructor(knexInstance) {
    if (!knexInstance) {
      throw new Error('Knex instance is not defined');
    }

    this.knex = knexInstance;

    this.identifierTable = 'identifiers';
  }

  async getIdentifierByUser(userId) {
    const identifier = await this.knex
      .select()
      .from(this.identifierTable)
      .where('user_id', userId)
      .first();

    return identifier
      ? IdentifierRepositoryKnex.formatIdentifier(identifier)
      : false;
  }

  async saveNextIdentifier(identifierInstance) {
    return this.knex.transaction(async (trx) => {
      const updated = await trx
        .table(this.identifierTable)
        .where('id', identifierInstance.getId())
        .andWhere('current', identifierInstance.getCurrentIdentifier())
        .update('current', identifierInstance.getNextIdentifier());

      if (updated !== 1) {
        throw new Error('Identifier outdated');
      }

      const createdIdentifier = await trx
        .table(this.identifierTable)
        .where('id', identifierInstance.getId())
        .first();

      return IdentifierRepositoryKnex.formatIdentifier(createdIdentifier);
    });
  }

  async updateIdentifier(identifierInstance) {
    return this.knex.transaction(async (trx) => {
      const updated = await trx
        .table(this.identifierTable)
        .where('id', identifierInstance.getId())
        .update('current', identifierInstance.getCurrentIdentifier());

      if (updated !== 1) {
        throw new Error('updateIdentifier failed updating');
      }

      const createdIdentifier = await trx
        .table(this.identifierTable)
        .where('id', identifierInstance.getId())
        .first();

      return IdentifierRepositoryKnex.formatIdentifier(createdIdentifier);
    });
  }

  async insertIdentifier(identifierInstance) {
    return this.knex.transaction(async (trx) => {
      const [identifierId] = await trx
        .insert({
          user_id: identifierInstance.getUserId(),
          current: identifierInstance.getCurrentIdentifier()
        })
        .into(this.identifierTable);

      const createdIdentifier = await trx
        .table(this.identifierTable)
        .where('id', identifierId)
        .first();

      return IdentifierRepositoryKnex.formatIdentifier(createdIdentifier);
    });
  }

  static formatIdentifier(identifierRaw) {
    return {
      id: identifierRaw.id,
      userId: identifierRaw.user_id,
      currentIdentifier: identifierRaw.current
    };
  }
}

module.exports = IdentifierRepositoryKnex;
