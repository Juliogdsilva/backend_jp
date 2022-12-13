const tableName = 'sellers';

/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').primary().unsigned();
    t.string('name', 100).notNullable();
    t.string('cpf', 80).notNullable().unique();
    t.string('phone', 80).notNullable();
    t.string('dam_number', 100).notNullable().unique();
    t.integer('dam_type').unsigned().notNullable().references('id')
      .inTable('dam_type');
    t.boolean('association_member').notNullable().defaultTo(0);
    t.string('association', 150).nullable();
    t.string('neighborhood', 1500).notNullable();
    t.string('picture').nullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at').nullable().defaultTo(knex.fn.now());
    t.timestamp('deleted_at').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
