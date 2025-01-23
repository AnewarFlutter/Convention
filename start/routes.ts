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
import SessionController from '#controllers/auth/session_controller'

import router from '@adonisjs/core/services/router'
import NvdemandesController from '#controllers/client/nvdemandes_controller';
import { middleware } from './kernel.js';

// Routes publiques
router.on('/').render('accueil/index').as('home')
router.get('/login', [SessionController, 'index']).as('login.index')
router.get('/register', [SessionController, 'register']).as('register.index')
router.get('/contact', [ContactsController, 'index']).as('contacts.index')

// Routes authentification
router.post('/register', [SessionController, 'store']).as('register.store')
router.post('/login', [SessionController, 'login']).as('login.store')
router.post('/logout', [SessionController, 'logout'])

// Routes admin protégées
router.group(() => {
  router.get('/admin/dashboard', [DashboardController, 'adminDashboard'])
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

  // Documents légaux  
  router.get('/entreprise/documents_legaux', [NvdemandesController, 'documentLegaux'])
    .as('entreprise.documents_legaux')

  // Effectif entreprise
  router.get('/entreprise/effectif', [NvdemandesController, 'effectifEntreprise'])
    .as('entreprise.effectif')
})
.use(middleware.auth()) // Vérifie l'authentification
.use(middleware.user()) // Vérifie si utilisateur normal







