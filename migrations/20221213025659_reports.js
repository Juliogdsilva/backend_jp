const tableName = 'reports';

/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').primary().unsigned();
    t.string('uuid').unique().notNullable();
    t.string('type').nullable();
    t.timestamp('time').nullable();
    t.text('description').nullable();
    t.string('url').nullable();
    t.string('status', 60).notNullable().defaultTo('waiting');
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
