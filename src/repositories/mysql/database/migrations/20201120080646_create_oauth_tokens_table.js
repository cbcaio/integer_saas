exports.up = function (knex) {
  return knex.schema.createTable('oauth_tokens', (table) => {
    table.engine('InnoDB');
    table.charset('utf8');
    table.collate('utf8_general_ci');

    table.increments();
    table.integer('user_id').unsigned().notNullable();
    table.integer('client_id').unsigned();

    table.text('access_token').notNullable();
    table.bigInteger('access_token_expires_at').notNullable();

    table.text('refresh_token').notNullable();
    table.bigInteger('refresh_token_expires_at');

    table.foreign('user_id').references('id').inTable('users');

    table.foreign('client_id').references('client_id').inTable('oauth_clients');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('oauth_tokens');
};
