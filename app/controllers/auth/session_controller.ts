import { DateTime } from 'luxon'
import User from '#models/user'
import Mail from '@adonisjs/mail'
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

  // Génère un code OTP à 6 chiffres
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Traitement de l'inscription
  async store({ request, response, mail }: HttpContext) {
    try {
      // Récupération des données du formulaire
      const data = request.only([
        'name',
        'full_name',
        'email',
        'password',
        'role'
      ])

      // Génération de l'OTP et sa date d'expiration
      const otp = this.generateOTP()
      const otp_expires_at = DateTime.now().plus({ minutes: 10 }) // Expire dans 10 minutes

      // Création de l'utilisateur avec OTP
      const user = await User.create({
        name: data.name,
        full_name: data.full_name,
        email: data.email,
        password: await hash.make(data.password),
        role: data.role || 'user',
        otp: otp,
        otp_expires_at: otp_expires_at,
        email_verified_at: null,
        remember_me_token: null
      })

      // Envoi de l'email avec l'OTP
      await mail.send((message) => {
        message
          .from(process.env.MAIL_FROM_ADDRESS!)
          .to(user.email)
          .subject('Code de vérification - Direction de l\'Emploi')
          .htmlView('entreprise/mail/otp', {
            code: otp
          })
      })

      async sendWelcomeEmailLater({ params }: HttpContext) {
        const user = await User.findOrFail(params.id)
    
        await mail.sendLater((message) => {
          message
            .to(user.email)
            .subject('Bienvenue dans notre application')
            .htmlView('emails/welcome', { user })
        })
      }

      // Redirection vers la page de vérification OTP
      response.redirect().toRoute('verification.otp')

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      response.redirect().back()
    }
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