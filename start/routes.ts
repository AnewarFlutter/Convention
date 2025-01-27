/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ContactsController from '#controllers/view/contacts_controller'
import DashboardController from '#controllers/client/dashboard_controller';



import router from '@adonisjs/core/services/router'
import NvdemandesController from '#controllers/client/nvdemandes_controller';
import { middleware } from './kernel.js';
import DashboardAdminsController from '#controllers/admin/dashboard_admins_controller';
import LoginController from '#controllers/auth/login_controller';
import RegistersController from '#controllers/auth/registers_controller';
import LogoutsController from '#controllers/auth/logouts_controller';

// Routes publiques
router.on('/').render('accueil/index').as('home')
router.get('/login', [LoginController, 'index']).as('login.index')
router.get('/register', [RegistersController, 'index']).as('register.index')
router.get('/contact', [ContactsController, 'index']).as('contacts.index')

// Routes authentification
router.post('/register', [RegistersController, 'store']).as('register.store')
router.post('/login', [LoginController, 'login']).as('login.store')
router.post('/logout', [LogoutsController, 'logout']).as('logout.store')

// Routes admin protégées
router.group(() => {
  router.get('/admin/dashboard', [DashboardAdminsController, 'index'])
    .as('admin.dashboard')
  // Autres routes admin...
}).use(middleware.auth()) // Vérifie l'authentification
.use(middleware.admin()) // Vérifie si admin










// Routes user protégées 
router.group(() => {
  // Dashboard utilisateur
  router.get('/dashboard', [DashboardController, 'index'])
    .as('dashboard.index')

  // Informations entreprise
  router.get('/entreprise/informations', [NvdemandesController, 'index'])
    .as('entreprise.informations')


  // Informations entreprise

  router.post('/entreprise/store', [NvdemandesController, 'storeInfomationEntreprise'])
    .as('entreprise.informations.store')




  // Documents légaux  
  router.get('/entreprise/documents_legaux', [NvdemandesController, 'documentLegaux'])
    .as('entreprise.documents_legaux')

  // Documents légaux

  router.post('/entreprise/documents_legaux/store', [NvdemandesController, 'storeDocumentLegaux'])
    .as('entreprise.documents_legaux.store')
 

  // Effectif entreprise
  router.get('/entreprise/effectif', [NvdemandesController, 'effectifEntreprise'])
    .as('entreprise.effectif')

  // Ajouter cette nouvelle route
  router.post('/entreprise/effectif/store', [NvdemandesController, 'storeEffectifEntreprise'])
    .as('entreprise.effectif.store')

})
.use(middleware.auth()) // Vérifie l'authentification
.use(middleware.user()) // Vérifie si utilisateur normal







