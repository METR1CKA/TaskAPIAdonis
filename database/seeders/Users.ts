import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import User from 'App/Models/Users/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    const roles = await Role.createMany(
      [
        {
          'name': 'DEV',
          'active': true,
          'description': ''
        },
        {
          'name': 'ADMIN',
          'active': true,
          'description': ''
        },
        {
          'name': 'EDITOR',
          'active': true,
          'description': ''
        }
      ]
    )

    const users = await User.createMany(
      [
        {
          'email': 'dev@tasks.com',
          'password': 'dev.pass',
          'active': true,
          'rol_id': roles[0].id
        },
        {
          'email': 'admin@tasks.com',
          'password': 'admin.pass',
          'active': true,
          'rol_id': roles[1].id
        }
      ]
    )

    await Profile.createMany(
      [
        {
          'user_id': users[0].id,
          'name': 'Developer',
          'lastname': 'Tasks',
          'phone': '8711293580',
          'address': 'GitHub'
        },
        {
          'user_id': users[1].id,
          'name': 'Administrator',
          'lastname': 'Tasks',
          'phone': '8711293580',
          'address': 'GitHub'
        },
      ]
    )
  }
}
