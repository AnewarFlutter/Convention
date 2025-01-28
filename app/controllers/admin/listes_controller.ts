import InfoEntreprise from '#models/info_entreprise';
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
  async create({ response }: HttpContext) {
    try {
      const infoEntreprise = await InfoEntreprise.query()
        .preload('formeJuridique')
        .preload('domaineActivite')
        .orderBy('created_at', 'desc')
        .exec()

      // Transformation en camelCase
      const formattedData = infoEntreprise.map(item => ({
        id: item.id,
        idUser: item.id_user,
        codeDemande: item.code_demande,
        nomEntreprise: item.nom_entreprise, 
        nomRepresentant: item.nom_representant,
        prenomRepresentant: item.prenom_representant,
        adresse: item.adresse,
        email: item.email,
        telephone: item.telephone,
        rccmFile: item.rccm_file,
        nineaFile: item.ninea_file,
        declarationFile: item.declaration_file,
        dateAdhesion: item.date_adhesion ? item.date_adhesion.toFormat('yyyy-MM-dd'): null,
        formeJuridiqueId: item.forme_juridique_id,
        domaineActiviteId: item.domaine_activite_id,
        autreDomaine: item.autre_domaine,
        nbCdi: item.nb_cdi,
        nbCdd: item.nb_cdd,
        quitusFiscal: item.quitus_fiscal,
        quitusSocial: item.quitus_social, 
        nbStagiaires: item.nb_stagiaires,
        profilsRecherches: item.profils_recherches,
        carteIdentite: item.carte_identite,
        demande: item.demande,
        renouvellement: item.renouvellement,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        formeJuridique: item.formeJuridique.libelle,
        domaineActivite: item.domaineActivite.libelle
      }))
      console.log(formattedData) 
      return response.json(formattedData)
    } catch (error) {
      console.error('Erreur:', error)
      return response.status(500).json({ error: 'Erreur lors de la récupération des informations' })
    }
  }

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