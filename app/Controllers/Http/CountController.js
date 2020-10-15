/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Client = use('App/Models/Client');

class CountController {
  async index({ auth }) {
    const count = await auth.getUser();

    const clients = await Client.query().where('count_id', count.id).fetch();

    return { count, clients };
  }

  // async store({ request, response }) {}

  // async show({ params auth }) {
  //   const user = await auth.getUser();

  //   return user;
  // }

  // async update({ params, request, response }) {
  //   const data = request.only(['name', 'password', 'oldPassword']);

  // }

  // async destroy({ params, request, response }) {}
}

module.exports = CountController;
