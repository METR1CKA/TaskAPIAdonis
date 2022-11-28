import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FilesController {

  public header = 'Accept-Language'

  public async read({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async delete({}: HttpContextContract) {}

}
