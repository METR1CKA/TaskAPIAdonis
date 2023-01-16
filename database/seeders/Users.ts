import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import User from 'App/Models/Users/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    const rol_dev = await Role.create(
      {
        name: 'DEV',
        active: true,
        description: 'Role with all system privileges'
      }
    )

    const rol_admin = await Role.create(
      {
        name: 'ADMIN',
        active: true,
        description: 'Role with all company privileges'
      }
    )

    await Role.create(
      {
        name: 'EDITOR',
        active: true,
        description: 'Role with some privileges'
      }
    )

    const developer = await User.create(
      {
        email: 'dev@tasks.com',
        password: 'dev.pass',
        active: true,
        role_id: rol_dev.id
      }
    )

    const admin = await User.create(
      {
        email: 'admin@tasks.com',
        password: 'admin.pass',
        active: true,
        role_id: rol_admin.id
      }
    )

    await Profile.createMany(
      [
        {
          user_id: developer.id,
          name: 'Developer',
          lastname: 'Tasks',
          phone: '8711293580',
          address: 'GitHub'
        },
        {
          user_id: admin.id,
          name: 'Administrator',
          lastname: 'Tasks',
          phone: '8711293580',
          address: 'GitHub'
        },
      ]
    )
  }
}
