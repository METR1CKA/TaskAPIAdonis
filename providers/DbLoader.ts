import type { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
import type { Translations, LoaderContract } from '@ioc:Adonis/Addons/I18n'

export type DbLoaderConfig = {

  enabled: true,

  table: string,

}

export class DbLoader implements LoaderContract {

  constructor(private db: DatabaseContract, private config: DbLoaderConfig) {}

  public async load() {

    const rows = await this.db.from(this.config.table)

    return rows.reduce<Translations>((result, row) => {

      result[row.locale] = result[row.locale] || {}

      result[row.locale][row.key] = row.message

      return result

    }, {})

  }
}