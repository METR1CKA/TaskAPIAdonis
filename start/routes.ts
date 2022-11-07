/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import MessagesI18n from 'App/Messages/MessagesI18n'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/Users/User'
import './Auth/routes'
import './Files/routes'
import './Users/routes'

Route.get('/', async () => {
  return { SERVER: 'ACTIVE' }
})

Route.get('api/v1', async () => {
  return { API: 'V1' }
})

Route.get('api/v1/user', async ({ response, auth, request }) => {

  const lang = new MessagesI18n(request.header('Accept-language'))

  const user = await User.findOrFail(auth.use('api').user?.id)

  return Env.get('NODE_ENV') === 'development'
    ? response.ok({
      message: lang.messageA('messages.success.authUser'),
      status: lang.messageA('messages.SUCCESSFUL'),
      data: user
    })
    : response.badRequest({
      message: lang.messageA('messages.errors.noProd'),
      status: lang.messageA('messages.FAILED'),
      data: null
    })

}).middleware(['lang', 'auth'])

Route.any('*', ({ response, request }) => {

  const lang = new MessagesI18n(request.header('Accept-language'))

  return response.notFound({
    message: lang.messageA('messages.errors.route.notFound'),
    status: lang.messageA('messages.FAILED'),
    data: null
  })

}).middleware('lang')