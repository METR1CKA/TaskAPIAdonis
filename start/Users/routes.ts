import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.group(() => {

    // ROLES

    //READ
    Route.get('get/:id?', 'RolesController.get')
    //CREATE
    Route.post('create', 'RolesController.create')
    //UPDATE
    Route.put('update/:id', 'RolesController.update')
    //DELETE
    Route.delete('delete/:id', 'RolesController.delete')

  })
    .prefix('roles')
    .namespace('App/Controllers/Http/Roles')

  Route.group(() => {

    // USERS

    //READ
    Route.get('get/:id?', 'UsersController.get')
    //CREATE
    Route.post('create', 'UsersController.create')
    //UPDATE
    Route.put('update/:id', 'UsersController.update')
    //DELETE
    Route.delete('delete/:id', 'UsersController.delete')

  })
    .prefix('users')
    .namespace('App/Controllers/Http/Users')

})
  .prefix('api/v1')
  .middleware(['lang', 'auth', 'role_user'])

Route.group(() => {
  // PASSWORDS

  Route.put('update/:id', 'PasswordsController.updateId').middleware('role_user')
  Route.put('update', 'PasswordsController.updateAuth')
})
  .prefix('api/v1/password')
  .namespace('App/Controllers/Http/Passwords')
  .middleware(['lang', 'auth'])