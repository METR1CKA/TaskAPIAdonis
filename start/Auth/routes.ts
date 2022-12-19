import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.post('login', 'AuthController.login')
  Route.post('register', 'AuthController.register')

  Route.group(() => {

    Route.post('logout', 'AuthController.logout')
    Route.get('me', 'AuthController.me')

  }).middleware('auth')

})
  .prefix('api/v1/auth')
  .namespace('App/Controllers/Http/Auth')
  .middleware('lang')