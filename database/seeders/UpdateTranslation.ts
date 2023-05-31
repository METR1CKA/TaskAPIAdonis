import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Translation from 'App/Models/Translation'
import fs from 'fs'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    const translations: Translation[] = JSON.parse(
      fs.readFileSync('resources/Translations/I18n.json').toString('utf-8')
    )

    const currentTranslations = await Translation.query().where({ locale: 'en' })

    const updatableTranslations = translations.filter(
      tl => currentTranslations.findIndex(ct => ct.key == tl.key) != -1
    )
    console.log('updatableTranslations:', updatableTranslations.length)

    const adddableTranslations = translations.filter(
      tl => currentTranslations.findIndex(ct => ct.key == tl.key) == -1
    )
    console.log('adddableTranslations:', adddableTranslations.length)

    updatableTranslations.forEach(async upd => {
      await Translation.query()
        .where({ key: upd.key, locale: upd.locale })
        .update({ message: upd.message })
    })

    await Translation.createMany(adddableTranslations)
  }
}
