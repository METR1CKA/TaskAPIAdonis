import I18n from '@ioc:Adonis/Addons/I18n'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Users/Category'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import RoleView from 'App/Models/Users/RoleView'
import User from 'App/Models/Users/User'
import View from 'App/Models/Users/View'
import Translation from 'App/Models/Translation'

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

    const rol_editor = await Role.create(
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
          address: 'GitHub',
          lang_id: 1
        },
        {
          user_id: admin.id,
          name: 'Administrator',
          lastname: 'Tasks',
          phone: '8721223489',
          address: 'GitHub',
          lang_id: 1
        },
      ]
    )

    const categories = await Category.createMany([
      {
        active: true,
        order_index: 1,
        name: 'Administration',
        description: 'Administration section',
        key: 'category.admin.name',
        keyd: 'category.admin.desc'
      },
      {
        active: true,
        order_index: 2,
        name: 'Tasks',
        description: 'Tasks section',
        key: 'category.task.name',
        keyd: 'category.task.desc'
      },
      {
        active: true,
        order_index: 3,
        name: 'Settings',
        description: 'Settings section',
        key: 'category.settings.name',
        keyd: 'category.settings.desc'
      },
    ])

    const views = await View.createMany([
      // Users
      {
        category_id: 1,
        active: true,
        key: 'view.users.name',
        name: 'Users',
        order_index: 1,
        url: 'admin/users',
        description: 'Users',
        keyd: 'view.users.desc'
      },
      {
        category_id: 1,
        active: true,
        key: 'view.categories.name',
        name: 'Categories',
        order_index: 2,
        url: 'admin/categories',
        description: 'Categories',
        keyd: 'view.categories.desc'
      },
      {
        category_id: 1,
        active: true,
        key: 'view.roles.name',
        name: 'Roles',
        order_index: 3,
        url: 'admin/roles',
        description: 'Roles',
        keyd: 'view.roles.desc'
      },
      {
        category_id: 1,
        active: true,
        key: 'view.views.name',
        name: 'Views',
        order_index: 4,
        url: 'admin/views',
        description: 'Views',
        keyd: 'view.views.desc'
      },
      {
        category_id: 1,
        active: true,
        key: 'view.roles_views.name',
        name: 'Roles Views',
        order_index: 5,
        url: 'admin/roles_views',
        description: 'Roles Views',
        keyd: 'view.roles_views.desc'
      },
      // Tasks
      {
        category_id: 2,
        active: true,
        key: 'view.tasks.name',
        name: 'Tasks',
        order_index: 1,
        url: 'tasks',
        description: 'Tasks',
        keyd: 'view.task.desc'
      },
      // Settings
      {
        category_id: 3,
        active: true,
        key: 'view.settings.name',
        name: 'Settings',
        order_index: 1,
        url: 'settings',
        description: 'Settings',
        keyd: 'view.settings.desc'
      },
    ])

    await RoleView.createMany([
      // Users
      { role_id: rol_dev.id, view_id: 1, active: true },
      { role_id: rol_admin.id, view_id: 1, active: true },

      // Categories
      { role_id: rol_dev.id, view_id: 2, active: true },
      { role_id: rol_admin.id, view_id: 2, active: true },

      // Roles
      { role_id: rol_dev.id, view_id: 3, active: true },
      { role_id: rol_admin.id, view_id: 3, active: true },

      // Views
      { role_id: rol_dev.id, view_id: 4, active: true },
      { role_id: rol_admin.id, view_id: 4, active: true },

      // Roles Views
      { role_id: rol_dev.id, view_id: 5, active: true },
      { role_id: rol_admin.id, view_id: 5, active: true },

      // Tasks
      { role_id: rol_dev.id, view_id: 6, active: true },
      { role_id: rol_admin.id, view_id: 6, active: true },
      { role_id: rol_editor.id, view_id: 6, active: true },

      // Settings
      { role_id: rol_dev.id, view_id: 7, active: true },
      { role_id: rol_admin.id, view_id: 7, active: true },
      { role_id: rol_editor.id, view_id: 7, active: true },
    ])

    const locales = I18n.supportedLocales()

    for (const view of views) {
      const keys = locales.map(locale => {
        return {
          locale,
          key: view.key,
          message: view.name
        }
      })

      const keysd = locales.map(locale => {
        return {
          locale,
          key: view.keyd,
          message: view.description
        }
      })

      await Translation.createMany(keys)
      await Translation.createMany(keysd)
    }

    for (const category of categories) {
      const keys = locales.map(locale => {
        return {
          locale,
          key: category.key,
          message: category.name
        }
      })

      const keysd = locales.map(locale => {
        return {
          locale,
          key: category.keyd,
          message: category.description
        }
      })

      await Translation.createMany(keys)
      await Translation.createMany(keysd)
    }
  }
}
