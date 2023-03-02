const tableName = 'participants';

/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').primary().unsigned();
    t.string('first_name', 100).notNullable();
    t.string('last_name', 100).notNullable();
    t.string('email', 100).notNullable().unique();
    t.string('phone', 80).nullable();
    t.string('birthdate', 80).nullable();
    t.string('shoe_number', 80).nullable();
    t.string('company', 80).nullable();
    t.string('companion', 80).nullable();
    t.string('document_type', 80).nullable();
    t.string('doc_number', 80).nullable();
    t.string('special_needs', 80).nullable();
    t.string('special_needs_describe', 80).nullable();
    t.string('arrival_date', 80).nullable();
    t.string('arrival_time', 80).nullable();
    t.string('departure_date', 80).nullable();
    t.string('departure_time', 80).nullable();
    t.string('flight_number', 80).nullable();
    t.string('have_allergy', 80).nullable();
    t.string('allergy', 80).nullable();
    t.string('password', 100).notNullable();
    t.string('registration_fee', 80).nullable();
    t.string('letter', 80).nullable();
    t.string('status', 50).notNullable().defaultTo('wait_payment');
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
