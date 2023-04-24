# TASKAPI

`RESTFUL API` basico de tareas, un proyecto `BACK-END` con funcionalidades basicas de una `API` en [AdonisJS 5](https://docs.adonisjs.com/guides/introduction "AdonisJs") incluyendo librerias propias del proyecto, aunque puede ser escalable e incluir tambien de terceros

## REQUISITOS:

1. Usar node con la version que indica el archivo [`.nvmrc`](./.nvmrc)

2. Por defecto el proyecto usa como BD `PostgreSQL`, aunque lo puedes reconfigurar como se indica en la documentación. [Configuración de base de datos](https://docs.adonisjs.com/guides/database/introduction "AdonisJs")

## CONFIGURACIÓN:

1. Instalar las dependencias de `node`

```console
$ npm install
```

2. Configurar un archivo `.env` en base al archivo [`.env.example`](./.env.example)

3. Poner en `false` el `loader` de `db` antes de correr las `migraciones` y los `seeders`, en el archivo `Env`

```env
DB_I18n=false;
```

4. Correr las `migraciones` con el siguiente comando

```console
$ npm run db:fresh
```

5. Poner en `true` el `loader` de `db` antes de correr las `migraciones` y los `seeders`, en el archivo `Env`

```env
DB_I18n=true;
```

6. Inicializar el servidor con el siguiente comando

```console
$ npm run dev
```

## NODE SCRIPTS:

| SCRIPT             | FUNCIÓN                         |
| ------------------ | ------------------------------- |
| npm run dev        | Iniciar el servidor             |
| npm run db:refresh | Refresca la BD y correr seeders |
| npm run db:fresh   | Corre migraciones y seeders     |
| npm run db:seed    | Corre el seeder que elijas      |
| npm run db:seeds   | Corre todos los seeders         |
