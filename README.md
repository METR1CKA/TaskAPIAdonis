# TASKAPI

`RESTFUL API` basico de tareas, un proyecto `BACK-END` con funcionalidades basicas de una `API` en [AdonisJS 5](https://docs.adonisjs.com/guides/introduction "AdonisJs") incluyendo librerias propias del proyecto, aunque puede ser escalable e incluir tambien de terceros

## REQUISITOS:

1. Usar node o nvm (mas recomendable nvm) con la version que indica el archivo [`./.nvmrc`](./.nvmrc)

2. Por defecto el proyecto usa como base de datos `PostgreSQL`, aunque lo puedes reconfigurar como se indica en la documentación. [Configuración de base de datos](https://docs.adonisjs.com/guides/database/introduction "AdonisJs")

## CONFIGURACIÓN:

1. Instalar las dependencias de `node`

~~~console
$ npm install
~~~

2. Poner en `false` el `loader` de `db` antes de correr las `migraciones` y los `seeders`, en el archivo de configuración de [`I18n`](./config/i18n.ts)

~~~typescript
import { I18nConfig } from '@ioc:Adonis/Addons/I18n'

const i18nConfig: I18nConfig = {
  loaders: {
    fs: {
      enabled: true,
      location: Application.resourcesPath('lang'),
    },
    db: {
      enabled: false,
      table: 'translations'
    }
  }
}
~~~

3. Correr las `migraciones` con el siguiente comando

~~~console
$ npm run db:run
~~~

4. Poner en `true` el `loader` de `db` despues de correr las `migraciones` y los `seeders`, en el archivo de configuración de [`I18n`](./config/i18n.ts)

~~~typescript
import { I18nConfig } from '@ioc:Adonis/Addons/I18n'

const i18nConfig: I18nConfig = {
  loaders: {
    fs: {
      enabled: true,
      location: Application.resourcesPath('lang'),
    },
    db: {
      enabled: true,
      table: 'translations'
    }
  }
}
~~~

5. Inicializar el servidor con el siguiente comando

~~~console
$ npm run dev
~~~

## NODE SCRIPTS:

|       SCRIPT        |             FUNCIÓN             |
|---------------------|---------------------------------|
| npm run dev         | Iniciar el servidor             |
| npm run db:refresh  | Refresca la BD y correr seeders |
| npm run db:run      | Corre migraciones y seeders     |
| npm run migration   | Corre migraciones               |
| npm run seed        | Corre el seeder que elijas      |
| npm run seeds       | Corre todos los seeders         |
