import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.group(() => {

    Route.get('get/:filename', 'FilesController.getFile')
    Route.post('upload', 'FilesController.uploadFile')
    Route.delete('delete/:filename', 'FilesController.deleteFile')

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