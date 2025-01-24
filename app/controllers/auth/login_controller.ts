import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('auth/login')
  }



   async login({ request, auth, response, session }: HttpContext) {
     const { email, password } = request.only(['email', 'password'])
     
     try {
       const user = await User.verifyCredentials(email, password)
       
       if (!user.email_verified_at) {
         session.flash('warning', 'Veuillez vérifier votre email')
         return response.redirect().toRoute('verification.otp')
       }
  
       await auth.use('web').login(user)
  
       return user.role === 'admin' 
         ? response.redirect('/admin/dashboard')
         : response.redirect('/dashboard')
  
     } catch (error) {
       session.flash('errors', { login: 'Identifiants invalides' })
       return response.redirect().back()
     }
   }

  
}