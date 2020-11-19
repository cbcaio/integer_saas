class IdentifierRepositoryKnex {
  constructor(knexInstance) {
    if (!knexInstance) {
      throw new Error('Knex instance is not defined');
    }

    this.knex = knexInstance;

    this.primaryKey = 'id';
    this.identifierTable = 'user_identifier';
    this.identifierCurrentValueColumn = 'current';
    this.userForeignKey = 'user_id';
  }

  async findIdentifierByUser(user) {
    return this.knex
      .select()
      .from(this.identifierTable)
      .where(this.userForeignKey, user.getId());
  }

  async updateIdenfitier(identifier) {
    return this.knex
      .table(this.identifierTable)
      .where(this.primaryKey, identifier.getId())
      .update(
        this.identifierCurrentValueColumn,
        identifier.getCurrentIdentifier()
      );
  }

  async insertIdentifier(identifier) {
    return this.knex.insert(identifier.toJSON()).into(this.identifierTable);
  }
}

module.exports = IdentifierRepositoryKnex;
