/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ClientReleased extends Model {
  static get table() {
    return 'cad_cnpjliberado';
  }

  static get primaryKey() {
    return 'cnpjliberado_id';
  }

  client() {
    return this.hasOne(
      'App/Models/Client',
      'clientes_cnpj',
      'cnpjliberado_cnpj'
    );
  }

  count() {
    return this.hasOne('App/Models/Count', 'contador_id', 'contador_id');
  }
}

module.exports = ClientReleased;
