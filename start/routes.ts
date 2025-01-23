/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ContactsController from '#controllers/contacts_controller'
import DashboardController from '#controllers/dashboard_controller';
import LoginController from '#controllers/login_controller'
import NvdemandesController from '#controllers/nvdemandes_controller';
import router from '@adonisjs/core/services/router'

router.on('/').render('accueil/index').as('home');

// Corriger la route contacts
router.get('/contact', [ContactsController, 'index']).as('contacts.index');

router.get('/login', [LoginController, 'index']).as('login.index');



//A proteger avec un middleware authentification

//Dashboard
router.get('/dashboard', [DashboardController, 'index']).as('dashboard.index');


//Informations entreprise

router.get('/entreprise/informations', [NvdemandesController, 'index']).as('entreprise.informations');


//Documents legaux

router.get('/entreprise/documents_legaux', [NvdemandesController, 'documentLegaux']).as('entreprise.documents_legaux');

//Effectif entreprise

router.get('/entreprise/effectif', [NvdemandesController, 'effectifEntreprise']).as('entreprise.effectif');

//Recapitulatif informations

router.get('/entreprise/recapitulatif', [NvdemandesController, 'recapitulatifInfo']).as('entreprise.recapitulatif');

