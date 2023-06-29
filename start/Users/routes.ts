import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Administration
  Route.group(() => {
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
       *    summary: Update user by id
       *    description: Update users by id
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
       *    description: Get all categories
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/CategoriesGetSuccess'
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

      /**
       * @swagger
       * /api/v1/categories/update/{id}:
       *  patch:
       *    tags:
       *      - Categories
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Update category by id
       *    description: Update categories by id
       *    requestBody:
       *      $ref: '#/components/requestBodies/CategoryUpdateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.patch('update/:id', 'CategoriesController.update')

      /**
       * @swagger
       * /api/v1/categories/delete/{id}:
       *  delete:
       *    tags:
       *      - Categories
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Delete category by id
       *    description: Delete categories by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.delete('delete/:id', 'CategoriesController.delete')
    })
      .prefix('categories')

    // Views
    Route.group(() => {
      /**
       * @swagger
       * /api/v1/views/get:
       *  get:
       *    tags:
       *      - Views
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Get all views
       *    description: Get all views
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/ViewsGetSuccess'
       * /api/v1/views/get/{id}:
       *  get:
       *    tags:
       *      - Views
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Get one view by id
       *    description: Get view by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/ViewGetOneSuccess'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.get('get/:id?', 'ViewsController.get')

      /**
       * @swagger
       * /api/v1/views/create:
       *  post:
       *    tags:
       *      - Views
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Create view
       *    description: Create view
       *    requestBody:
       *      $ref: '#/components/requestBodies/ViewsCreateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.post('create', 'ViewsController.create')

      /**
       * @swagger
       * /api/v1/views/update/{id}:
       *  patch:
       *    tags:
       *      - Views
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Update view by id
       *    description: Update views by id
       *    requestBody:
       *      $ref: '#/components/requestBodies/ViewUpdateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.patch('update/:id', 'ViewsController.update')

      /**
       * @swagger
       * /api/v1/views/delete/{id}:
       *  delete:
       *    tags:
       *      - Views
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Delete view by id
       *    description: Delete views by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.delete('delete/:id', 'ViewsController.delete')
    })
      .prefix('views')

    // Roles
    Route.group(() => {
      /**
       * @swagger
       * /api/v1/roles/get:
       *  get:
       *    tags:
       *      - Roles
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Get all roles
       *    description: Get all roles
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/RolesGetSuccess'
       * /api/v1/roles/get/{id}:
       *  get:
       *    tags:
       *      - Roles
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Get one role by id
       *    description: Get roles by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/RoleGetOneSuccess'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.get('get/:id?', 'RolesController.read')

      /**
       * @swagger
       * /api/v1/roles/create:
       *  post:
       *    tags:
       *      - Roles
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *    security:
       *      - bearerAuth: []
       *    summary: Create roles
       *    description: Create role
       *    requestBody:
       *      $ref: '#/components/requestBodies/RolesCreateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.post('create', 'RolesController.create')

      /**
       * @swagger
       * /api/v1/roles/update/{id}:
       *  patch:
       *    tags:
       *      - Roles
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Update roles by id
       *    description: Update role by id
       *    requestBody:
       *      $ref: '#/components/requestBodies/RolesUpdateRequest'
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '400':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.patch('update/:id', 'RolesController.update')

      /**
       * @swagger
       * /api/v1/roles/delete/{id}:
       *  delete:
       *    tags:
       *      - Roles
       *    produces:
       *      - application/json
       *    parameters:
       *      - $ref: '#/components/parameters/LocaleHeader'
       *      - $ref: '#/components/parameters/IdParam'
       *    security:
       *      - bearerAuth: []
       *    summary: Delete roles by id
       *    description: Delete role by id
       *    responses:
       *      '200':
       *        $ref: '#/components/responses/DefaultResponse'
       *      '404':
       *        $ref: '#/components/responses/ResponseNotFound'
       */
      Route.delete('delete/:id', 'RolesController.delete')
    })
      .prefix('roles')

    // Roles Views
    Route.group(() => {
      Route.get('get/:id?', 'RoleViewsController.get')
      Route.patch('update/:id', 'RoleViewsController.update')
    })
      .prefix('roles_views')
  })
    .middleware(['lang', 'auth', 'role_user'])

  // PASSWORDS
  Route.group(() => {
    Route.patch('update/:id', 'PasswordsController.updateId')
      .middleware('role_user')
    Route.patch('update', 'PasswordsController.updateAuth')
  })
    .prefix('password')
    .middleware(['lang', 'auth'])
})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Users')