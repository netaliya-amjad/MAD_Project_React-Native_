
exports.up = function (knex) {
    return knex.schema.createTable('bookings', function (table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('nailart_id').unsigned().references('id').inTable('nailart_designs').onDelete('CASCADE');
      table.date('booking_date').notNullable();
      table.string('time_slot').notNullable();
      table.string('artist_name').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('bookings');
  };
  