/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CountSchema extends Schema {
  up() {
    this.create('counts', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('counts');
  }
}

module.exports = CountSchema;
