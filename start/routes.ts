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
import MessagesI18n from 'App/Services/MessagesI18n'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/Users/User'
import './Auth/routes'
import './Tasks/routes'
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

  const status = Env.get('NODE_ENV') === 'development' ? 200 : 400

  const message = lang.getMessage(status === 200 ? 'auth.user' : 'only.dev')

  const data = !user ? null : user

  return response.status(status).json({ message, data })

}).middleware(['lang', 'auth'])

Route.any('*', ({ response, request }) => {

  const lang = new MessagesI18n(request.header('Accept-language'))

  return response.notFound({
    message: lang.getMessage('notFound.route'),
    data: null
  })

}).middleware('lang')