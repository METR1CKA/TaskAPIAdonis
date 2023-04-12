import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Translation from 'App/Models/Translation'
import Lang from 'App/Models/Users/Lang'
import fs from 'fs'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    const translations: Translation[] = JSON.parse(fs.readFileSync('resources/Translations/I18n.json').toString('utf-8'))

    await Translation.createMany(translations)

    await Lang.createMany([
      {
        name: 'Español',
        code: 'es'
      },
      {
        name: 'English',
        code: 'en'
      }
    ])
  }
}
