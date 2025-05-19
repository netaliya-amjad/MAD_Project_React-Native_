
exports.up = function (knex) {
    return knex.schema.createTable('nail_paints', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.decimal('price', 8, 2).notNullable();
      table.string('image_url').notNullable();
      table.float('rating').defaultTo(0);
      table.integer('reviews_count').defaultTo(0);
      table.integer('stock').defaultTo(0);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('nail_paints');
  };
  