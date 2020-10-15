/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Client extends Model {
  count() {
    return this.belongsTo('App/Models/Count');
  }
}

module.exports = Client;