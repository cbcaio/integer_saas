exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.engine('InnoDB');
    table.charset('utf8');
    table.collate('utf8_general_ci');

    table.increments('id');
    table.string('username').notNullable();
    table.text('password');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
