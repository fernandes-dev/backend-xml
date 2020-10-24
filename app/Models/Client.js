/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Client extends Model {
  static get table() {
    return 'cad_clientes';
  }

  static get primaryKey() {
    return 'clientes_id';
  }

  count() {
    return this.belongsTo('App/Models/Count');
  }
}

module.exports = Client;
