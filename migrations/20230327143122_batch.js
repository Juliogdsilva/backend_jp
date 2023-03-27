const tableName = 'batch';

/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable(tableName, (t) => {
        t.increments('id').primary().unsigned();
        t.string('name').unique().notNullable();
        t.integer('limit').nullable();
        t.integer('current_quantity').notNullable().defaultTo(0);
        t.timestamp('date_limit').nullable();
        t.integer('time_limit').nullable();
        t.integer('usage_limit').nullable();
        t.text('description').nullable();
        t.string('status').notNullable().defaultTo('ative');
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
