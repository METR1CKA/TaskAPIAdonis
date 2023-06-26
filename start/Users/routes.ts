import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Administration
  Route.group(() => {
    // Roles
    Route.group(() => {
      Route.get('get/:id?', 'RolesController.read')
      Route.post('create', 'RolesController.create')
      Route.patch('update/:id', 'RolesController.update')
      Route.delete('delete/:id', 'RolesController.delete')
    })
      .prefix('roles')

    // Users
    Route.group(() => {
      /**
       * @swagger
       * /api/v1/users/get:
       *  get:
       *    tags:
       *      - Users
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Get users
       *    description: Get all users
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/UsersGetSuccess'
       */

      /**
       * @swagger
       * /api/v1/users/get/{id}:
       *  get:
       *    tags:
       *      - Users
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Get user by id
       *    description: Get user by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/UserGetOneSuccess'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.get('get/:id?', 'UsersController.read')

      /**
       * @swagger
       * /api/v1/users/create:
       *  post:
       *    tags:
       *      - Users
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Create user
       *    description: Create users
       *    requestBody:
       *      $ref: '#/components/requestBodies/UserCreateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.post('create', 'UsersController.create')

      /**
       * @swagger
       * /api/v1/users/update/{id}:
       *  patch:
       *    tags:
       *      - Users
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Update user
       *    description: Update users
       *    requestBody:
       *      $ref: '#/components/requestBodies/UsersUpdateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.patch('update/:id', 'UsersController.update')

      /**
       * @swagger
       * /api/v1/users/delete/{id}:
       *  delete:
       *    tags:
       *      - Users
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Delete users by id
       *    description: Delete users by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.delete('delete/:id', 'UsersController.delete')
    })
      .prefix('users')

    // Categories
    Route.group(() => {
      /**
       * @swagger
       * /api/v1/categories/get:
       *  get:
       *    tags:
       *      - Categories
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Get all categories
       *    description: Get all users
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/CategoriesGetSuccess'
       */

      /**
       * @swagger
       * /api/v1/categories/get/{id}:
       *  get:
       *    tags:
       *      - Categories
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Get one category by id
       *    description: Get category by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/CategoryGetOneSuccess'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.get('get/:id?', 'CategoriesController.get')

      /**
       * @swagger
       * /api/v1/categories/create:
       *  post:
       *    tags:
       *      - Categories
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Create category
       *    description: Create category
       *    requestBody:
       *      $ref: '#/components/requestBodies/CategoryCreateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.post('create', 'CategoriesController.create')
      Route.patch('update/:id', 'CategoriesController.update')
      Route.delete('delete/:id', 'CategoriesController.delete')
    })
      .prefix('categories')

    // Views
    Route.group(() => {
      Route.get('get/:id?', 'ViewsController.get')
      Route.post('create', 'ViewsController.create')
      Route.patch('update/:id', 'ViewsController.update')
      Route.delete('delete/:id', 'ViewsController.delete')
    })
      .prefix('views')

    // Roles Views
    Route.group(() => {
      Route.get('get/:id?', 'RoleViewsController.get')
      Route.post('create', 'RoleViewsController.create')
      Route.patch('update/:id', 'RoleViewsController.update')
      Route.delete('delete/:id', 'RoleViewsController.delete')
    })
      .prefix('roles_views')
  })
    .middleware(['lang', 'auth', 'role_user'])

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