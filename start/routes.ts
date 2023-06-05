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

/** Ruta Raiz
 * @swagger
 * /:
 *  get:
 *    tags:
 *      - Endpoints
 *    summary: Base url
 *    description: Base url
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/DefaultResponse'
 *      '404':
 *        description: Get user succcessful
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RouteNotFound'
 */
Route.get('/', ({ response }) => {
  const GREETING = 'API TASKS'

  return response.ok({
    statusRessponse: 'Success',
    data: {
      message: GREETING,
    }
  })
})


/* Wildcard */
Route.any('*', ({ response, request }) => {
  const ROUTE_NOT_FOUND = 'Ruta no encontrada / Route not found'

  return response.badRequest({
    statusResponse: 'Client error',
    data: {
      message: ROUTE_NOT_FOUND,
      method: request.method(),
      routeNotFound: request.url()
    }
  })
})