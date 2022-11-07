import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  // USERS

  Route.group(() => {
    //READ
    Route.get('get/:id?', 'UsersController.get')

    //CREATE
    Route.post('create', 'UsersController.create')

    //UPDATE
    Route.put('update/:id', 'UsersController.update')

    //DELETE
    Route.delete('delete/:id', 'UsersController.delete')
  }).prefix('users')

  // ROLES

  Route.group(() => {
    //READ
    Route.get('get/:id?', 'RolesController.get')

    //CREATE
    Route.post('create', 'RolesController.create')

    //UPDATE
    Route.put('update/:id', 'RolesController.update')

    //DELETE
    Route.delete('delete/:id', 'RolesController.delete')
  }).prefix('roles')

  // PASSWORDS

  Route.group(() => {
    //UPDATE PASSWORD AUTH USER
    Route.get('update', 'PasswordsController.updateAuth')

    //UPDATE PASSWORD BY ID
    Route.put('update/:id', 'PasswordsController.updateId')
  }).prefix('passwords')

})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Users')
  .middleware(['lang', 'auth', 'role_user'])