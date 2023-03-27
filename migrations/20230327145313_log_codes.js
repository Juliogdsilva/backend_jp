const tableName = 'log_codes';

/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').primary().unsigned();
    t.integer('code_id').unsigned().notNullable().references('id')
      .inTable('codes');
    t.string('action').unique().notNullable();
    t.text('description').nullable();
    t.integer('created_by').unsigned().nullable().references('id')
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
