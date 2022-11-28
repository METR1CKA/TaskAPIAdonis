import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Translation from 'App/Models/Translation'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await Translation.createMany([
      { locale: 'en', key: 'user', message: 'User' },
      { locale: 'es', key: 'user', message: 'Usuario' },

      { locale: 'en', key: 'users', message: 'Users' },
      { locale: 'es', key: 'users', message: 'Usuarios' },

      { locale: 'en', key: 'role', message: 'Role' },
      { locale: 'es', key: 'role', message: 'Rol' },

      { locale: 'en', key: 'roles', message: 'Roles' },
      { locale: 'es', key: 'roles', message: 'Roles' },

      { locale: 'en', key: 'password', message: 'Password' },
      { locale: 'es', key: 'password', message: 'Contraseña' },

      { locale: 'en', key: 'task', message: 'Task' },
      { locale: 'es', key: 'task', message: 'Tarea' },

      { locale: 'en', key: 'tasks', message: 'Tasks' },
      { locale: 'es', key: 'tasks', message: 'Tareas' },

      { locale: 'en', key: 'type', message: 'Type' },
      { locale: 'es', key: 'type', message: 'Tipo' },

    ])
  }
}
