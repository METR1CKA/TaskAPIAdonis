import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  //Login
  Route.post('login', 'AuthController.login')

  //Register
  Route.post('register', 'AuthController.register')

  Route.group(() => {
    //Logout
    Route.post('logout', 'AuthController.logout')

    //Me
    Route.get('me', 'AuthController.me')
  }).middleware('auth')
})
  .prefix('api/v1/auth')
  .namespace('App/Controllers/Http/Auth')
  .middleware('lang')