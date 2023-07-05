import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Files
  Route.group(() => {
    /**
     * @swagger
     * /api/v1/files/upload:
     *  post:
     *    tags:
     *      - Files
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *    security:
     *      - bearerAuth: []
     *    summary: Upload files to type image
     *    description: Service to upload files (images)
     *    requestBody:
     *      description: Data for upload files
     *      required: true
     *      content:
     *        multipart/form-data:
     *          schema:
     *            type: object
     *            properties:
     *              file:
     *                type: string
     *                format: binary
     *          encoding:
     *            file:
     *              contentType: image/*
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/FileUploadResponse'
     *      '400':
     *        $ref: '#/components/responses/DefaultResponse'
     */
    Route.post('upload', 'FilesController.uploadFile')

    /**
     * @swagger
     * /api/v1/files/get/{filename}:
     *  get:
     *    tags:
     *      - Files
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *      - $ref: '#/components/parameters/FilenameParam'
     *    security:
     *      - bearerAuth: []
     *    summary: Get file (image)
     *    description: Get file (image) with filename
     *    responses:
     *      '200':
     *        description: Return response file (image)
     *        content:
     *          image/*:
     *            schema:
     *              type: string
     *              format: binary
     *      '404':
     *        $ref: '#/components/responses/ResponseNotFound'
     */
    Route.get('get/:filename', 'FilesController.files')

    /**
     * @swagger
     * /api/v1/files/delete/{filename}:
     *  delete:
     *    tags:
     *      - Files
     *    produces:
     *      - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/LocaleHeader'
     *      - $ref: '#/components/parameters/FilenameParam'
     *    security:
     *      - bearerAuth: []
     *    summary: Delete file (image)
     *    description: Delete file (image) with filename
     *    responses:
     *      '200':
     *        $ref: '#/components/responses/DefaultResponse'
     *      '404':
     *        $ref: '#/components/responses/ResponseNotFound'
     */
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
