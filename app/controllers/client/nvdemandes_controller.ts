import type { HttpContext } from '@adonisjs/core/http'
import ViteMiddleware from '@adonisjs/vite/vite_middleware'
import { v4 as uuidv4 } from 'uuid'; // Importer une bibliothèque pour générer des UUID

export default class NvdemandesController {
  /**
   * Display a list of resource
   */
  
  async index({view}: HttpContext) {
    var activeNouvelleDemande = true;

    return view.render('entreprise/nouvelle_demande/information_entreprise', {activeNouvelleDemande})
  }


  async storeInfomationEntreprise({ request, response, session }: HttpContext) {
    // Définir les règles de validation
    const validationSchema = schema.create({
      nom_entreprise: schema.string({ trim: true }, [
        rules.required(),
      ]),
      nom_representant: schema.string({ trim: true }, [
        rules.required(),
      ]),
      prenom_representant: schema.string({ trim: true }, [
        rules.required(),
      ]),
      adresse: schema.string({ trim: true }, [
        rules.required(),
      ]),
      email: schema.string({ trim: true }, [
        rules.required(),
        rules.email(),
        rules.unique({ table: 'info_entreprises', column: 'email' }),
      ]),
      telephone: schema.string({}, [
        rules.required(),
        rules.mobile({ locales: ['fr-FR'] }),
      ]),
    })

    // Valider les données du formulaire
    const validatedData = await request.validate({
      schema: validationSchema,
      messages: {
        'nom_entreprise.required': 'Le nom de l\'entreprise est obligatoire.',
        'nom_representant.required': 'Le nom du représentant est obligatoire.',
        'prenom_representant.required': 'Le prénom du représentant est obligatoire.',
        'adresse.required': 'L\'adresse de l\'entreprise est obligatoire.',
        'email.required': 'L\'email de l\'entreprise est obligatoire.',
        'email.email': 'L\'email doit être une adresse email valide.',
        'email.unique': 'Cet email est déjà utilisé.',
        'telephone.required': 'Le numéro de téléphone est obligatoire.',
        'telephone.mobile': 'Le numéro de téléphone doit être valide.',
      },
    })

    // Créer une nouvelle instance de InfoEntreprise avec les données validées
    const infoEntreprise = new InfoEntreprise()
    infoEntreprise.nom_entreprise = validatedData.nom_entreprise
    infoEntreprise.nom_representant = validatedData.nom_representant
    infoEntreprise.prenom_representant = validatedData.prenom_representant
    infoEntreprise.adresse = validatedData.adresse
    infoEntreprise.email = validatedData.email
    infoEntreprise.telephone = validatedData.telephone
    infoEntreprise.idUser = auth.user!.id // Remplacez par l'ID utilisateur approprié
    infoEntreprise.codeDemande = uuidv4() // Remplacez par le code de demande approprié

    // Sauvegarder les données dans la base de données
    await infoEntreprise.save()

    // Ajouter un message de succès et rediriger
    session.flash('success', 'Les informations de l\'entreprise ont été enregistrées avec succès.')
    return response.redirect().toRoute('entreprise.documents_legaux')
  }


  //================================================================================================

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