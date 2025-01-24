import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@adonisjs/lucid/orm'
import FormeJuridique from './FormeJuridique'
import DomaineActivite from './DomaineActivite'

export default class InfoEntreprise extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public idUser: string

  @column()
  public codeDemande: string

  @column()
  public nom_entreprise: string

  @column()
  public nom_representant: string

  @column()
  public prenom_representant: string

  @column()
  public adresse: string

  @column()
  public email: string

  @column()
  public telephone: string

  @column()
  public rccm_file: string

  @column()
  public ninea_file: string

  @column()
  public declaration_file: string

  @column.date()
  public date_adhesion: DateTime

  @column()
  public forme_juridique_id: number

  @column()
  public domaine_activite_id: number

  @column()
  public autre_domaine: string

  @column()
  public nb_cdi: number

  @column()
  public nb_cdd: number

  @column()
  public quitus_fiscal: string

  @column()
  public quitus_social: string

  @column()
  public nb_stagiaires: number

  @column()
  public profils_recherches: string

  @column()
  public carte_identite: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => FormeJuridique, {
    foreignKey: 'forme_juridique_id',
  })
  public formeJuridique: BelongsTo<typeof FormeJuridique>

  @belongsTo(() => DomaineActivite, {
    foreignKey: 'domaine_activite_id',
  })
  public domaineActivite: BelongsTo<typeof DomaineActivite>
}