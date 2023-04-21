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
import Service from '@ioc:Adonis/Providers/Services'
import './Auth/routes'
import './Tasks/routes'
import './Users/routes'

Route.get('/', ({ response }) => {
  Service.setResponseObject(response)

  return Service.httpResponse(200, 'API TASKS')
})

Route.any('*', ({ response, request }) => {
  Service.setResponseObject(response)

  return Service.httpResponse(200, 'Ruta no encontrada / Route not found', {
    method: request.method(),
    routeNotFound: request.url()
  })
})