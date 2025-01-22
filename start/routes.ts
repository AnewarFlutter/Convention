/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ContactsController from '#controllers/contacts_controller'
import LoginController from '#controllers/login_controller'
import router from '@adonisjs/core/services/router'

router.on('/').render('accueil/index').as('home')

// Corriger la route contacts
router.get('/contact', [ContactsController, 'index']).as('contacts.index').use(
    middleware.auth({
      guards: ['web']
    })
router.get('/login', [LoginController, 'index']).as('login.index')
