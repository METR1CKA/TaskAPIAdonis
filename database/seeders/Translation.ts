import Application from '@ioc:Adonis/Core/Application'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Translation from 'App/Models/Translation'
import fs from 'fs'

export default class extends BaseSeeder {
  public async run() {

    // Write your database queries inside the run method

    const path = Application.resourcesPath('Translations')

    const filename = 'I18n.json'

    const fullpath = `${path}\\${filename}`

    const translations: Translation[] = JSON.parse(fs.readFileSync(fullpath).toString('utf-8'))

    await Translation.createMany(translations)

  }
}
