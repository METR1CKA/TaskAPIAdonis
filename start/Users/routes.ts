import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('get/:id?', 'RolesController.read')
      Route.post('create', 'RolesController.create')
      Route.patch('update/:id', 'RolesController.update')
      Route.delete('delete/:id', 'RolesController.delete')
    })
      .prefix('roles')

    Route.group(() => {
      Route.get('get/:id?', 'UsersController.read')
      Route.post('create', 'UsersController.create')
      Route.patch('update/:id', 'UsersController.update')
      Route.delete('delete/:id', 'UsersController.delete')
    })
      .prefix('users')

    Route.group(() => {
      Route.get('get/:id?', 'CategoriesController.get')
      Route.post('create', 'CategoriesController.create')
      Route.patch('update/:id', 'CategoriesController.update')
      Route.delete('delete/:id', 'CategoriesController.delete')
    })
      .prefix('categories')

    Route.group(() => {
      Route.get('get/:id?', 'ViewsController.get')
      Route.post('create', 'ViewsController.create')
      Route.patch('update/:id', 'ViewsController.update')
      Route.delete('delete/:id', 'ViewsController.delete')
    })
      .prefix('views')

    Route.group(() => {
      Route.get('get/:id?', 'RoleViewsController.get')
      Route.post('create', 'RoleViewsController.create')
      Route.patch('update/:id', 'RoleViewsController.update')
      Route.delete('delete/:id', 'RoleViewsController.delete')
    })
      .prefix('roles_views')
  }).middleware(['lang', 'auth', 'role_user'])

  // PASSWORDS
  Route.group(() => {
    Route.patch('update/:id', 'PasswordsController.updateId').middleware('role_user')
    Route.patch('update', 'PasswordsController.updateAuth')
  })
    .prefix('password')
    .middleware(['lang', 'auth'])
})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Users')