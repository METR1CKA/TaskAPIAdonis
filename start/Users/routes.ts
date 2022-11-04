import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  //READ
  Route.get('get/:id?', 'UsersController.get')

  //CREATE
  Route.post('create', 'UsersController.create')

  //UPDATE
  Route.put('update/:id', 'UsersController.update')

  //DELETE
  Route.delete('delete/:id', 'UsersController.delete')
})
  .prefix('api/v1/users')
  .namespace('App/Controllers/Http/Users')
  .middleware(['lang', 'auth', 'role_user'])