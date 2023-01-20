
/* A way to tell typescript that the module `@ioc:Adonis/Providers/Services` is a module that exports a
class `Services` */
declare module '@ioc:Adonis/Providers/Services' {
  import Services from 'App/Services/Services'

  const Service: Services

  export default Service
}