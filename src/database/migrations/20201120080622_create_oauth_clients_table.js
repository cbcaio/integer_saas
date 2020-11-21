exports.up = function (knex) {
  return knex.schema.createTable('oauth_clients', (table) => {
    table.engine('InnoDB');
    table.charset('utf8');
    table.collate('utf8_general_ci');

    table.integer('client_id').unsigned().notNullable();
    table.string('client_secret').notNullable();
    table.text('redirect_uri').notNullable();

    table.primary(['client_id', 'client_secret']);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('oauth_clients');
};
