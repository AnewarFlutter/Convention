import type { HttpContext } from '@adonisjs/core/http'
import ViteMiddleware from '@adonisjs/vite/vite_middleware'

export default class NvdemandesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    var activeNouvelleDemande = true;

    return view.render('entreprise/nouvelle_demande/information_entreprise', {activeNouvelleDemande})
  }


  async documentLegaux({view}: HttpContext) {

    return view.render('entreprise/nouvelle_demande/document_legaux')
  }


  async effectifEntreprise({view}: HttpContext) {

    return view.render('entreprise/nouvelle_demande/information_effectif')
  }

  async recapitulatifInfo({view}: HttpContext) {

    return view.render('entreprise/nouvelle_demande/recapitulatif_info')
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
  async update({ }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}