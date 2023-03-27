const tableName = 'codes';

/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').primary().unsigned();
    t.string('code').unique().notNullable();
    t.integer('batch_id').unsigned().notNullable().references('id')
      .inTable('batch');
    t.integer('batch_number').notNullable();
    t.string('name').nullable();
    t.string('phone').nullable();
    t.string('email').nullable();
    t.text('note').nullable();
    t.string('status').notNullable().defaultTo('waiting');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
