const path = require('path');
const dree = require('dree');
// const sizeOnDisk = require('size-on-disk');
// const onezip = require('onezip');

const fs = require('fs');

const archiver = require('archiver');
const AdmZip = require('adm-zip');

class FolderController {
  async index({ response }) {
    response.implicitEnd = false;

    try {
      let dir;
      if (process.env.NODE_ENV === 'production')
        dir = path.resolve('/', 'home', 'ftpvedas', 'vedas-ftp', 'xml');
      else dir = path.resolve('/', 'Users', 'eduar', 'Desktop', 'xml');

      const tree = dree.scan(dir, { depth: 1 });

      return tree;
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Nenhum diretório encontrado', error: error.message });
    }
  }

  // async store({ request, response }) {
  //   response.implicitEnd = false;
  //   const { dir, type } = request.all();

  //   let typeBar = '/';
  //   if (dir.includes('\\')) typeBar = '\\';
  //   else if (dir.includes('/')) typeBar = '/';
  //   else if (dir.includes('//')) typeBar = '//';

  //   const resolved = path.resolve('/', ...dir.split(typeBar));

  //   const isZip = resolved.indexOf('.zip') > 0;

  //   try {
  //     if (isZip) return response.download(resolved);

  //     if (type === 'directory') {
  //       await zip(resolved, `${resolved}.zip`);
  //       return response.download(`${resolved}.zip`);
  //     }

  //     const zipFile = new AdmZip();

  //     zipFile.addLocalFile(resolved);
  //     zipFile.writeZip(`${resolved}.zip`);

  //     return response.download(`${resolved}.zip`);
  //   } catch (error) {
  //     return response
  //       .status(400)
  //       .send({ message: 'Erro ao zipar arquivo', error: error.message });
  //   }
  // }

  async store({ request, response }) {
    response.implicitEnd = false;
    const { dir, type, name } = request.all();

    const typeBar = '\\';

    const resolved = path.resolve('/', ...dir);
    let newDir = dir;
    newDir.pop();
    newDir = path.resolve('/', ...newDir);

    const isZip = resolved.indexOf('.zip') > 0;

    try {
      if (isZip || type === 'zip') return response.download(resolved);

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
          // return
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

      return tree;
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Nenhum diretório encontrado', error: error.message });
    }
  }
}

module.exports = FolderController;
