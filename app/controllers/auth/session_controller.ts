import User from '#models/user' 
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class SessionController {
  // Page de connexion
  async index({ view }: HttpContext) {
    return view.render('auth/login')
  }

  // Page d'inscription 
  async register({ view }: HttpContext) {
    return view.render('auth/register')
  }

  // Traitement de l'inscription
  async store({ request, response }: HttpContext) {
    // Récupération des données du formulaire
    const data = request.only([
      'name',
      'full_name', 
      'email',
      'password',
      'role'
    ])

    // Création de l'utilisateur
    await User.create({
      name: data.name,
      full_name: data.full_name,
      email: data.email,
      password: await hash.make(data.password),
      role: data.role || 'user', // Role par défaut
      email_verified_at: null,
      remember_me_token: null,
      otp: null,
      otp_expires_at: null
    })

    response.redirect('/login')
  }

  // Traitement de la connexion
  async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    
    try {
      // Vérification des credentials
      const user = await User.verifyCredentials(email, password)
      
      // Connexion de l'utilisateur
      await auth.use('web').login(user)

      // Redirection selon le rôle
      if (user.role === 'admin') {
        response.redirect('/admin/dashboard')
      } else {
        response.redirect('/dashboard') 
      }
    } catch {
      response.redirect().back()
      // Ajouter un message d'erreur
    }
  }

  // Déconnexion
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect('/login')
  }
}