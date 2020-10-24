/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CadContadorSchema extends Schema {
  up() {
    this.table('cad_contador', (table) => {
      table.timestamps();
    });
  }

  down() {
    this.table('cad_contador', (table) => {
      table.dropColumn('created_at');
      table.dropColumn('updated_at');
    });
  }
}

module.exports = CadContadorSchema;
