import type { HttpContext } from '@adonisjs/core/http'

export default class ListesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    var activeNouvelleDemande = true;
    return view.render('admin/listes/view_listes', {activeNouvelleDemande})
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}