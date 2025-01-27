import InfoEntreprise from '#models/info_entreprise';
import { Application } from '@adonisjs/core/app';
import app from '@adonisjs/core/services/app'

import type { HttpContext } from '@adonisjs/core/http'

import { schema, validator ,rules} from '@adonisjs/validator'
import FormeJuridique from '#models/forme_juridiques';
import DomaineActivite from '#models/domaines_activites';
import domaines_activites from '#models/domaines_activites';
import forme_juridiques from '#models/forme_juridiques';


export default class NvdemandesController {
  /**
   * Display a list of resource
   */
  
  async index({view, auth}: HttpContext) {
    var activeNouvelleDemande = true;
  
    // Récupérer l'utilisateur connecté 
    const user = auth.user!
  
    // Vérifier si l'utilisateur a déjà enregistré les informations de l'entreprise
    // et récupérer la dernière entrée avec renouvellement = 0
    const infoEntreprise = await InfoEntreprise.query()
      .where('id_user', user.id.toString())
      .where('renouvellement', 0)
      .orderBy('created_at', 'desc')
      .first()
  
    return view.render('entreprise/nouvelle_demande/information_entreprise', {
      activeNouvelleDemande, 
      infoEntreprise
    })
  }

  async storeInfomationEntreprise({ request, response, session, auth }: HttpContext) {
    try {
      // Récupérer l'utilisateur connecté 
      const user = auth.user!

      // Récupérer les données du formulaire
      const data = request.only([
        'code_demande', // Ajout du code_demande
        'nom_entreprise',
        'nom_representant',
        'prenom_representant', 
        'adresse',
        'email',
        'telephone'
      ])
      
      try {
        // Validation directe avec le schéma
        await validator.validate({
          schema: schema.create({
            nom_entreprise: schema.string(),
            nom_representant: schema.string(),
            prenom_representant: schema.string(),
            adresse: schema.string(),
            email: schema.string([
              rules.email()
            ]),
            telephone: schema.string([
              rules.minLength(9),
              rules.maxLength(9)
            ])
          }),
          data: data
        })
      } catch (error) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      // Vérifier si un code_demande existe (modification)
      if (data.code_demande) {
        // Mise à jour des informations existantes
        await InfoEntreprise.query()
          .where('code_demande', data.code_demande)
          .update({
            nom_entreprise: data.nom_entreprise,
            nom_representant: data.nom_representant,
            prenom_representant: data.prenom_representant,
            adresse: data.adresse,
            email: data.email,
            telephone: data.telephone
          })

        session.flash('success', "Les informations de l'entreprise ont été mises à jour avec succès")
      } else {
        // Création d'un nouveau code_demande pour un nouvel enregistrement
        const code_demande = `DEM-${Date.now()}`

        // Créer l'enregistrement
        await InfoEntreprise.create({
          id_user: user.id.toString(),
          code_demande: code_demande,
          nom_entreprise: data.nom_entreprise,
          nom_representant: data.nom_representant,
          prenom_representant: data.prenom_representant,
          adresse: data.adresse,
          email: data.email,
          telephone: data.telephone
        })

        session.flash('success', "Les informations de l'entreprise ont été enregistrées avec succès")
      }

      return response.redirect().toRoute('entreprise.documents_legaux')

    } catch (error) {
      console.error(error)
      session.flash('errors', {
        error: "Une erreur est survenue lors de l'enregistrement"
      })
      return response.redirect().back()
    }
  }


  //================================================================================================

  async documentLegaux({view}: HttpContext) {
    try {
      const activeNouvelleDemande = true;
      var formesJuridiques = await forme_juridiques.all();
      var domainesActivites = await domaines_activites.all();
     
      return view.render('entreprise/nouvelle_demande/document_legaux', {
        activeNouvelleDemande,
        formesJuridiques,  // Utiliser le même nom que dans la vue
        domainesActivites,  // Utiliser le même nom que dans la vue
      });
  
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }
  }


  async storeDocumentLegaux({ request, response, session, auth }: HttpContext) {
    try {
      const user = auth.user!
  
      // Gérer les fichiers uploadés 
      const rccmFile = request.file('rccm_file')
      const nineaFile = request.file('ninea_file')
      const declarationFile = request.file('declaration_file')
  
      // Validation des données
      try {
        await validator.validate({
          schema: schema.create({
            forme_juridique: schema.string(),
            domaine_activite: schema.string(),
            date_adhesion: schema.date(),
            autre_domaine: schema.string.optional()
          }),
          data: request.only([
            'forme_juridique',
            'domaine_activite', 
            'date_adhesion',
            'autre_domaine'
          ])
        })
      } catch (error) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }
  
      // Déplacer les fichiers dans public/assets/uploads
      const uploadPath = 'uploads/documents'
      
      if (rccmFile) {
        await rccmFile.move(app.publicPath(uploadPath), {
          name: `rccm_${Date.now()}.${rccmFile.extname}`
        })
      }
  
      if (nineaFile) {
        await nineaFile.move(app.publicPath(uploadPath), {
          name: `ninea_${Date.now()}.${nineaFile.extname}`
        })
      }
  
      if (declarationFile) {
        await declarationFile.move(app.publicPath(uploadPath), {
          name: `declaration_${Date.now()}.${declarationFile.extname}`
        })
      }
  
      // Mettre à jour l'enregistrement avec les chemins des fichiers
      await InfoEntreprise.query()
        .where('id_user', user.id.toString())
        .where('renouvellement', 0)
        .orderBy('created_at', 'desc')
        .first()
        .then((infoEntreprise) => {
          if (infoEntreprise) {
            infoEntreprise.merge({
              rccm_file: rccmFile ? `${uploadPath}/${rccmFile.fileName}` : '',
              ninea_file: nineaFile ? `${uploadPath}/${nineaFile.fileName}` : '',
              declaration_file: declarationFile ? `${uploadPath}/${declarationFile.fileName}` : '',
              forme_juridique_id: request.input('forme_juridique'),
              domaine_activite_id: request.input('domaine_activite'),
              autre_domaine: request.input('autre_domaine'),
              date_adhesion: request.input('date_adhesion')
            })
            return infoEntreprise.save()
          }
        })
  
      session.flash('success', "Les documents ont été enregistrés avec succès")
      return response.redirect().toRoute('entreprise.effectif')
  
    } catch (error) {
      console.error(error)
      session.flash('errors', {
        error: "Une erreur est survenue lors de l'enregistrement des documents"
      })
      return response.redirect().back()
    }
  }

  //================================================================================================

  async effectifEntreprise({view}: HttpContext) {

    return view.render('entreprise/nouvelle_demande/information_effectif')
  }

  async storeEffectifEntreprise({  request, response, session, auth }: HttpContext) {
    try {
      const user = auth.user!
  
      // Validation des données
      try {
        await validator.validate({
          schema: schema.create({
            nb_cdi: schema.number(),
            nb_cdd: schema.number(),
            quitus_fiscal: schema.string(),
            quitus_social: schema.string(),
            nb_stagiaires: schema.number(),
            profils_recherches: schema.string(),
            carte_identite: schema.string()
          }),
          data: request.only([
            'nb_cdi',
            'nb_cdd',
            'quitus_fiscal',
            'quitus_social',
            'nb_stagiaires',
            'profils_recherches',
            'carte_identite'
          ])
        })
      } catch (error) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }
  
      // Gérer les fichiers uploadés 
      const quitusFiscal = request.file('quitus_fiscal')
      const quitusSocial = request.file('quitus_social')
      const carteIdentite = request.file('carte_identite')
  
      // Déplacer les fichiers dans public/assets/uploads
      const uploadPath = 'uploads/documents'
  
      if (quitusFiscal) {
        await quitusFiscal.move(app.publicPath(uploadPath), {
          name: `quitus_fiscal_${Date.now()}.${quitusFiscal.extname}`
        })
      }
  
      if (quitusSocial) {
        await quitusSocial.move(app.publicPath(uploadPath), {
          name: `quitus_social_${Date.now()}.${quitusSocial.extname}`
        })
      }
  
      if (carteIdentite) {
        await carteIdentite.move(app.publicPath(uploadPath), {
          name: `carte_identite_${Date.now()}.${carteIdentite.extname}`
        })
      }
  
      // Mettre à jour l'enregistrement avec les chemins des fichiers
      await InfoEntreprise.query()
        .where('id_user', user.id.toString())
        .where('renouvellement', 0)
        .orderBy('created_at', 'desc')
        .first()
        .then((infoEntreprise) => {
          if (infoEntreprise) {
            infoEntreprise.merge({
              nb_cdi: request.input('nb_cdi'),
              nb_cdd: request.input('nb_cdd'),
              quitus_fiscal: quitusFiscal ? `${uploadPath}/${quitusFiscal.fileName}` : '',
              quitus_social: quitusSocial ? `${uploadPath}/${quitusSocial.fileName}` : '',
              nb_stagiaires: request.input('nb_stagiaires'),
              profils_recherches: request.input('profils_recherches'),
              carte_identite: carteIdentite ? `${uploadPath}/${carteIdentite.fileName}` : ''
            })
            return infoEntreprise.save()
          }
        }
      )

      session.flash('success', "Les informations ont été enregistrées avec succès")
      return response.redirect().toRoute('entreprise.recapitulatif')

    } catch (error) {
      console.error(error)
      session.flash('errors', {
        error: "Une erreur est survenue lors de l'enregistrement des informations"
      })
      return response.redirect().back()
    }

  }
async recapitulatif({view}: HttpContext) {
  
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