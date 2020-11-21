class IdentifierRepositoryKnex {
  constructor(knexInstance) {
    if (!knexInstance) {
      throw new Error('Knex instance is not defined');
    }

    this.knex = knexInstance;

    this.identifierTable = 'identifiers';
  }

  async getIdentifierByUser(userId) {
    return this.knex
      .select()
      .from(this.identifierTable)
      .where('user_id', userId)
      .first();
  }

  async updateIdentifier(identifier) {
    return this.knex.transaction(async (trx) => {
      const identifierId = await trx
        .table(this.identifierTable)
        .where('id', identifier.getId())
        .update('current', identifier.getCurrentIdentifier());

      const createdIdentifier = await trx
        .table(this.identifierTable)
        .where('id', identifierId)
        .first();

      return createdIdentifier;
    });
  }

  async insertIdentifier(identifier) {
    return this.knex.transaction(async (trx) => {
      const [identifierId] = await trx
        .insert({
          user_id: identifier.getUserId(),
          current: identifier.getCurrentIdentifier()
        })
        .into(this.identifierTable);

      const createdIdentifier = await trx
        .table(this.identifierTable)
        .where('id', identifierId)
        .first();

      return createdIdentifier;
    });
  }
}

module.exports = IdentifierRepositoryKnex;
