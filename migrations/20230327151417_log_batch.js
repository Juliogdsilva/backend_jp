const tableName = 'log_batch';

/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').primary().unsigned();
    t.integer('batch_id').unsigned().notNullable().references('id')
      .inTable('batch');
    t.integer('quantity').notNullable();
    t.integer('start_number').unique().notNullable();
    t.integer('last_number').unique().notNullable();
    t.string('status').notNullable().defaultTo('waiting');
    t.text('description').nullable();
    t.integer('created_by').unsigned().notNullable().references('id')
      .inTable('users');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
