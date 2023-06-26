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
    Route.get('get/:id?', 'TasksController.get')
    Route.post('create', 'TasksController.create')
    Route.patch('update/:id', 'TasksController.update')
    Route.put('status/:id', 'TasksController.taskStatus')
  })
    .prefix('tasks')
})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Tasks')
  .middleware(['lang', 'auth'])