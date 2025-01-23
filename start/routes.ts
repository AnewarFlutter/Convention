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
import NvdemandesController from '#controllers/client/nvdemandes_controller';
import router from '@adonisjs/core/services/router'

router.on('/').render('accueil/index').as('home');

// Corriger la route contacts
router.get('/contact', [ContactsController, 'index']).as('contacts.index');

router.get('/login', [SessionController, 'index']).as('login.index');

router.get('/register', [SessionController, 'register']).as('register.index');
// Routes authentifiées
router.group(() => {
    // Déconnexion
    router.post('/logout', [SessionController, 'logout'])

    // Dashboard
    router.get('/dashboard', [DashboardController, 'index'])
      .as('dashboard.index')

    // Informations entreprise
    router.get('/entreprise/informations', [NvdemandesController, 'index'])
      .as('entreprise.informations')

    // Documents légaux
    router.get('/entreprise/documents_legaux', [NvdemandesController, 'documentLegaux'])
      .as('entreprise.documents_legaux')

    // Effectif entreprise
    router.get('/entreprise/effectif', [NvdemandesController, 'effectif'])
      .as('entreprise.effectif')



  }).use(auth()) // Application du middleware d'authentification sur tout le groupe

