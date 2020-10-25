/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

// const Client = use('App/Models/Client');
const Count = use('App/Models/Count');
const Token = use('App/Models/Token');
const Encryption = use('Encryption');
const isAfter = require('date-fns/isAfter');
const addHours = require('date-fns/addHours');

class CountController {
  async index() {
    // const count = await auth.getUser();

    const counts = await Count.query().with('clientReleased').fetch();

    return counts;
  }

  async login({ request, response }) {
    try {
      const { contador_cnpj, contador_senha } = request.all();

      const count = await Count.findByOrFail({
        contador_cnpj,
        contador_senha,
      });

      if (count.contador_status !== 'ATIVO')
        return response.status(401).send({
          message: 'Seu cadastro está inativo.',
        });

      await Token.query().where('contador_id', count.contador_id).delete();

      const token = Encryption.encrypt(contador_cnpj + contador_senha);

      await Token.create({
        token,
        type: 'auth',
        contador_id: count.contador_id,
      });

      count.token = token;

      return count;
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao realizar login, entre em contato com o suporte',
        error: error.message,
      });
    }
  }

  async verify({ request, response }) {
    try {
      const token = await Token.findByOrFail({
        token: request.headers().authorization,
      });

      if (isAfter(new Date(), addHours(token.created_at, 20))) {
        return response.status(400).send({
          message: 'Sua sessão expirou, faça login novamente!',
        });
      }

      let count = await Count.query()
        .with('clientReleased')
        .where('contador_id', token.contador_id)
        .fetch();
      [count] = count.toJSON();

      if (count.contador_status !== 'ATIVO')
        return response.status(401).send({
          message: 'Seu cadastro está inativo.',
        });
      count.contador_cnpj = count.contador_cnpj.toString();
      count.token = token;

      return count;
    } catch (error) {
      return response.status(400).send({
        message: 'Sua sessão expirou, faça login novamente!',
        error: error.message,
      });
    }
  }

  // async show({ params }) {}

  async update({ request, response }) {
    try {
      const token = await Token.findByOrFail({
        token: request.headers().authorization,
      });
      const { contador_nome, contador_cnpj, contador_senha } = request.all();

      let count = await Count.findByOrFail({
        contador_id: token.contador_id,
      });

      count.merge({ contador_nome, contador_cnpj, contador_senha });

      await count.save();

      count = await Count.query()
        .with('clientReleased')
        .where('contador_id', token.contador_id)
        .fetch();

      [count] = count.toJSON();

      return count;
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao alterar senha',
        error: error.message,
      });
    }
  }

  // async destroy({ params, request, response }) {}
}

module.exports = CountController;
