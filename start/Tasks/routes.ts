import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Files
  Route.group(() => {
    Route.post('upload', 'FilesController.uploadFile')
    Route.get('get/:filename', 'FilesController.files')
    Route.delete('delete/:filename', 'FilesController.files')
  })
    .prefix('files')

  // Tasks
  Route.group(() => {
    /**
     * @swagger
     * /api/v1/tasks/get:
     *  get:
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *    security:
     *      - bearerAuth: []
     *    summary: Get tasks
     *    description: Get all tasks
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/TasksGetSuccess'
     * /api/v1/tasks/get/{id}:
     *  get:
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *      - $ref: '#/components/parameters/IdParam'
     *    security:
     *      - bearerAuth: []
     *    summary: Get tasks by id
     *    description: Get task by id
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/GetOneTaskSchema'
     *      '404':
     *        $ref: '#/components/responses/ResponseNotFound'
     */
    Route.get('get/:id?', 'TasksController.get')

    /**
     * @swagger
     * /api/v1/tasks/create:
     *  post:
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *    security:
     *      - bearerAuth: []
     *    summary: Create tasks
     *    description: Create task
     *    requestBody:
     *      $ref: '#/components/requestBodies/TaskCreateRequest'
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/DefaultResponse'
     *      '400':
     *        $ref: '#/components/responses/DefaultResponse'
     *      '404':
     *        $ref: '#/components/responses/ResponseNotFound'
     */
    Route.post('create', 'TasksController.create')

    /**
     * @swagger
     * /api/v1/tasks/update/{id}:
     *  patch:
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *      - $ref: '#/components/parameters/IdRoute'
     *    security:
     *      - bearerAuth: []
     *    summary: Update tasks by id
     *    description: Update task by id
     *    requestBody:
     *      $ref: '#/components/requestBodies/TaskUpdateRequest'
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/DefaultResponse'
     *      '400':
     *        $ref: '#/components/responses/DefaultResponse'
     *      '404':
     *        $ref: '#/components/responses/ResponseNotFound'
     */
    Route.patch('update/:id', 'TasksController.update')

    /**
     * @swagger
     * /api/v1/tasks/status/{id}:
     *  delete:
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *      - $ref: '#/components/parameters/IdRoute'
     *      - $ref: '#/components/parameters/Completed'
     *      - $ref: '#/components/parameters/Active'
     *    security:
     *      - bearerAuth: []
     *    summary: Complete or deactivate tasks by id
     *    description: Complete or deactivate task by id
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/DefaultResponse'
     *      '400':
     *        $ref: '#/components/responses/DefaultResponse'
     *      '404':
     *        $ref: '#/components/responses/ResponseNotFound'
     */
    Route.delete('status/:id', 'TasksController.taskStatus')
  })
    .prefix('tasks')
})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Tasks')
  .middleware(['lang', 'auth'])
