
exports.up = function (knex) {
    return knex.schema.createTable('nailart_designs', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('imageUrl').notNullable();
      table.text('description');
      table.decimal('price', 8, 2).notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('nailart_designs');
  };
  