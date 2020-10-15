/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Count extends Model {
  clients() {
    return this.hasMany('App/Models/Client');
  }
}

module.exports = Count;
