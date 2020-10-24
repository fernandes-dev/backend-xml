/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Count extends Model {
  static get table() {
    return 'cad_contador';
  }

  static get primaryKey() {
    return 'contador_id';
  }

  clientReleased() {
    return this.hasMany(
      'App/Models/ClientReleased',
      'contador_id',
      'contador_id'
    );
  }
}

module.exports = Count;
