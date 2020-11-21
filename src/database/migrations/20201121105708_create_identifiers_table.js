exports.up = function (knex) {
  return knex.schema.createTable('identifiers', (table) => {
    table.engine('InnoDB');
    table.charset('utf8');
    table.collate('utf8_general_ci');

    table.increments();
    table.integer('user_id').unsigned().notNullable().unique();
    table.bigInteger('current').notNullable();

    table.foreign('user_id').references('id').inTable('users');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('identifiers');
};
