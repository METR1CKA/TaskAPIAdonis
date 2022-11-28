import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.group(() => {
    // ROLES
    Route.group(() => {
      //READ
      Route.get('get/:id?', 'RolesController.read')
      //CREATE
      Route.post('create', 'RolesController.create')
      //UPDATE
      Route.put('update/:id', 'RolesController.update')
      //DELETE
      Route.delete('delete/:id', 'RolesController.delete')
    }).prefix('roles')
    // USERS
    Route.group(() => {
      //READ
      Route.get('get/:id?', 'UsersController.read')
      //CREATE
      Route.post('create', 'UsersController.create')
      //UPDATE
      Route.put('update/:id', 'UsersController.update')
      //DELETE
      Route.delete('delete/:id', 'UsersController.delete')
    }).prefix('users')

  }).middleware(['lang', 'auth', 'role_user'])

  // PASSWORDS
  Route.group(() => {
    Route.put('update/:id', 'PasswordsController.updateId').middleware('role_user')
    Route.put('update', 'PasswordsController.updateAuth')
  })
    .prefix('password')
    .middleware(['lang', 'auth'])

})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Users')