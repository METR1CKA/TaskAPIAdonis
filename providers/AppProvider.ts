import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { DbLoader } from './DbLoader'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready

    const I18n = this.app.container.resolveBinding('Adonis/Addons/I18n')

    const Db = this.app.container.resolveBinding('Adonis/Lucid/Database')

    I18n.extend('db', 'loader', (_, config) => {

      return new DbLoader(Db, config)

    })
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
