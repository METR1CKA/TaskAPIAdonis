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
import './Auth/routes'
import './Files/routes'
import './Passwords/routes'
import './Users/routes'

Route.get('/', async () => {
  return { SERVER: 'ACTIVE' }
})

Route.get('api/v1', async () => {
  return { API: 'V1' }
})

Route.get('api/v1/user', ({ response, auth, request }) => {
  const obj = new MessagesI18n(request.header('Accept-language'))

  return Env.get('NODE_ENV') === 'development'
    ? response.ok(
      obj.format(
        obj.messageA('messages.success.authUser'),
        obj.messageA('messages.SUCCESSFUL'),
        auth.use('api').user
      )
    )
    : response.badRequest(
      obj.format(
        obj.messageA('messages.errors.noProd'),
        obj.messageA('messages.FAILED'),
        null
      )
    )
}).middleware(['lang', 'auth'])

Route.any('*', ({ response, request }) => {
  const obj = new MessagesI18n(request.header('Accept-language'))

  const message = obj.format(
    obj.messageA('messages.errors.route.notFound'),
    obj.messageA('messages.FAILED'),
    null
  )

  return response.notFound(message)
}).middleware('lang')