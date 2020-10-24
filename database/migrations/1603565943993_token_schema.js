/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TokenSchema extends Schema {
  up() {
    this.create('tokens', (table) => {
      table.increments();
      table.string('token').notNullable();
      table.string('type').notNullable();
      table.integer('contador_id').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('tokens');
  }
}

module.exports = TokenSchema;
