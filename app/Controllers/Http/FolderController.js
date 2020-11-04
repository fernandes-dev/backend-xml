/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const path = require('path');
const dree = require('dree');
// const sizeOnDisk = require('size-on-disk');
// const onezip = require('onezip');

const fs = require('fs');

const archiver = require('archiver');
const AdmZip = require('adm-zip');

const Count = use('App/Models/Count');
const Client = use('App/Models/Client');
const Token = use('App/Models/Token');

class FolderController {
  async index({ response, request }) {
    response.implicitEnd = false;

    try {
      const token = await Token.findByOrFail({
        token: request.headers().authorization,
      });
      let count = await Count.query()
        .with('clientReleased')
        .where('contador_id', token.contador_id)
        .fetch();
      [count] = count.toJSON();

      let dir;
      if (process.env.NODE_ENV === 'production')
        dir = path.resolve('/', 'home', 'ftpvedas', 'vedas-ftp', 'xml');
      else dir = path.resolve('/', 'Users', 'eduar', 'Desktop', 'xml');

      const tree = dree.scan(dir, { depth: 1 });
      const cnpjs = count.clientReleased.map((item) =>
        item.cnpjliberado_cnpj.toString()
      );

      let clients = await Client.all();
      clients = clients.toJSON();
      const clientReleased = [];
      clients.forEach((c) => {
        if (c.clientes_cnpj && c.clientes_cnpj.length > 6)
          c.clientes_cnpj = c.clientes_cnpj.match(/[0-9]/g).join('');
        if (cnpjs.indexOf(c.clientes_cnpj) >= 0) {
          clientReleased.push(c);
        }
      });

      count.clientReleased = clientReleased;

      if (count.clientReleased.length > 0) {
        const newChildren = [];
        tree.children.forEach((folder) => {
          if (
            count.clientReleased.find(
              (item) => item.clientes_cnpj === folder.name
            )
          ) {
            folder.client = count.clientReleased.find(
              (item) => item.clientes_cnpj === folder.name
            );
            newChildren.push(folder);
          }
        });
        tree.children = newChildren;
      } else {
        const newChildren = [];
        tree.children.forEach((folder) => {
          if (clients.find((item) => item.clientes_cnpj === folder.name)) {
            folder.client = clients.find(
              (item) => item.clientes_cnpj === folder.name
            );
            newChildren.push(folder);
          }
        });
        tree.children = newChildren;
      }
      return tree;
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Nenhum diretório encontrado', error: error.message });
    }
  }

  /**
   * Delete a banner with id.
   * DELETE banners/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async store({ request, response }) {
    response.implicitEnd = false;

    response.header('content-type', 'application/zip');
    response.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // update to match the domain you will make the request from
    response.header(
      'Access-Control-Allow-Origin',
      'https://contabilidade.vedassistemas.com.br'
    ); // update to match the domain you will make the request from
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );

    const { dir, type, name } = request.all();

    const typeBar = '\\';

    const resolved = path.resolve('/', ...dir);
    let newDir = dir;
    newDir.pop();
    newDir = path.resolve('/', ...newDir);

    const isZip = resolved.indexOf('.zip') > 0;

    try {
      if (isZip || type === 'zip') {
        return response.download(resolved);
      }

      if (type === 'directory') {
        const archive = archiver('zip', {
          zlib: { level: 5 },
        });

        const output = fs.createWriteStream(`${newDir}${typeBar}${name}.zip`);

        // new Promise((resolve) => {
        //   sizeOnDisk(resolved, (err, bytes) => {
        //     if (err) throw err;
        //     resolve(bytes);
        //   });
        // }).then((e) => {
        //   return e;
        // });

        archive.pipe(output);
        archive.directory(resolved, name);

        await archive.finalize();

        output.on('close', () => {
          response.send(`${newDir}${typeBar}${name}.zip`);
        });
      }
      if (type !== 'directory') {
        const zipFile = new AdmZip();

        zipFile.addLocalFile(resolved);
        zipFile.writeZip(`${newDir}${typeBar}${name}.zip`);

        return response.download(`${newDir}${typeBar}${name}.zip`);
      }
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Erro ao zipar arquivo', error: error.message });
    }
  }

  async getWithPath({ request, response }) {
    const { getPath, depth } = request.all();

    try {
      const { value } = JSON.parse(getPath);

      const resolved = path.resolve('/', value);
      const tree = dree.scan(resolved, { depth });
      tree.children = tree.children.filter((c) => c.type === 'directory');

      return tree;
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Nenhum diretório encontrado', error: error.message });
    }
  }
}

module.exports = FolderController;
