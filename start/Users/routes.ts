import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

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

    //UPDATE PASSWORD BY ID
    Route.put('passwords/update/:id', 'PasswordsController.updateId')

  }).middleware('role_user')

  // PASSWORDS

  //UPDATE PASSWORD AUTH USER
  Route.get('passwords/update', 'PasswordsController.updateAuth')

})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Users')
  .middleware(['lang', 'auth'])