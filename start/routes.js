/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

const Helpers = use('Helpers');

// Temporary verification method
Route.get('/.well-known/acme-challenge/:key', ({ response }) => {
  return response.attachment(Helpers.publicPath('/challenge'));
});
Route.post('/login', 'CountController.login');
Route.post('/verify', 'CountController.verify');

Route.put('/update-password', 'CountController.update');

Route.resource('/count', 'CountController').apiOnly();

Route.resource('/client', 'ClientController').apiOnly();

Route.resource('/folder', 'FolderController').apiOnly();

Route.post('/folder-param', 'FolderController.getWithPath');

Route.get('*', () => {
  return { greeting: 'Hello world in JSON' };
});
