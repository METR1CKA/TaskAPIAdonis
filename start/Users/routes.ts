import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.group(() => {

    Route.group(() => {

      Route.get('get/:id?', 'RolesController.read')
      Route.post('create', 'RolesController.create')
      Route.put('update/:id', 'RolesController.update')
      Route.delete('delete/:id', 'RolesController.delete')

    }).prefix('roles')

    Route.group(() => {

      Route.get('get/:id?', 'UsersController.read')
      Route.post('create', 'UsersController.create')
      Route.put('update/:id', 'UsersController.update')
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