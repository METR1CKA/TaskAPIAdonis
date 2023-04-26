import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /**
   * @swagger
   * /api/v1/auth/login:
   *  post:
   *    tags:
   *      - Auth
   *    produces:
   *      - application/json
   *    parameters:
   *      - $ref: '#/components/parameters/LocaleHeader'
   *    summary: Sign in
   *    description: Login to authenticate
   *    requestBody:
   *      $ref: '#/components/requestBodies/LoginRequest'
   *    responses:
   *      '200':
   *        $ref: '#/components/responses/LoginSuccess'
   *      '400':
   *        $ref: '#/components/responses/LoginBadRequest'
   *      '404':
   *        $ref: '#/components/responses/ResponseNotFound'
   */
  Route.post('login', 'AuthController.login')

  /**
   * @swagger
   * /api/v1/auth/register:
   *  post:
   *    tags:
   *      - Auth
   *    produces:
   *      - application/json
   *    parameters:
   *      - $ref: '#/components/parameters/LocaleHeader'
   *    summary: Sign up
   *    description: Register to app
   *    requestBody:
   *      $ref: '#/components/requestBodies/RegisterRequest'
   *    responses:
   *      '200':
   *        $ref: '#/components/responses/DefaultResponse'
   *      '400':
   *        $ref: '#/components/responses/RegisterBadRequest'
   *      '404':
   *        $ref: '#/components/responses/ResponseNotFound'
   */
  Route.post('register', 'AuthController.register')

  Route.group(() => {
    /**
     * @swagger
     * /api/v1/auth/logout:
     *  post:
     *    tags:
     *      - Auth
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *    security:
     *      - bearerAuth: []
     *    summary: Sign out 
     *    description: Revoke the session
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/LogoutSuccess'
     */
    Route.post('logout', 'AuthController.logout')

    /**
     * @swagger
     * /api/v1/auth/me:
     *  get:
     *    tags:
     *      - Auth
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *    security:
     *      - bearerAuth: []
     *    summary: Me
     *    description: Get my User info
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/MeSuccess'
     */
    Route.get('me', 'AuthController.me')
  }).middleware('auth')
})
  .prefix('api/v1/auth')
  .namespace('App/Controllers/Http/Auth')
  .middleware('lang')