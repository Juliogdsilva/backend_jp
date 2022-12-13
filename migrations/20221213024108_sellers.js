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
    t.string('phone', 80).nullable();
    t.string('dam_number', 100).notNullable().unique();
    t.integer('dam_type').unsigned().notNullable().references('id')
      .inTable('dam_type');
    t.boolean('association_member').notNullable().defaultTo(0);

    t.string('gender', 50).nullable();
    t.timestamp('birth_date').nullable();
    t.string('cep', 40).nullable();
    t.string('street', 255).nullable();
    t.integer('number').nullable();
    t.string('neighborhood', 80).nullable();
    t.string('complement', 200).nullable();
    t.string('city', 80).nullable();
    t.string('state', 80).nullable();
    t.string('provider', 50).notNullable().defaultTo('signup');
    t.string('status', 50).notNullable().defaultTo('active');
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
