import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get(':filename', 'FilesController.files')
    Route.post('upload', 'FilesController.uploadFile')
    Route.delete(':filename', 'FilesController.files')
  }).prefix('files')

  Route.group(() => {
    Route.get('get', 'TasksController.read')
    Route.get('get/:id', 'TasksController.read')
    Route.post('create', 'TasksController.create')
    Route.put('update/:id', 'TasksController.update')
    Route.delete('delete/:id', 'TasksController.delete')
  }).prefix('tasks')
})
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Tasks')
  .middleware(['lang', 'auth'])