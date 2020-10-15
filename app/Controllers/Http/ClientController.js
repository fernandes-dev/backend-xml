const Client = use('App/Models/Client');

class ClientController {
  async index({ auth }) {
    const count = await auth.getUser();

    const clients = await Client.query().where('count_id', count.id).fetch();

    return clients;
  }

  // async store({ request, response }) {}

  async show({ params }) {
    const client = await Client.findByOrFail({ cnpj: params.cnpj });

    return client;
  }
}

module.exports = ClientController;

// let dirs = listFiles(dir);
// // const download = await readFile(a[0]);

// // return response.send(download);
// dirs = dirs.map((item) => {
//   let newItem = item.split('xml')[1];
//   newItem = newItem.replace(/\\/g, '/');
//   return newItem;
// });
// const newDir = [];

// dirs.forEach((item) => {
//   const newItem = item.split('/');
//   if (!newDir.find((item2) => item2.root === newItem[1]))
//     newDir.push({ root: newItem[1], child: [] });
//   else
//     newDir.forEach((item2) => {
//       item2.child.push(item);
//     });
// });
