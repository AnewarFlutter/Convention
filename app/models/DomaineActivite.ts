import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@adonisjs/lucid/orm'
import InfoEntreprise from './InfoEntreprise'

export default class DomaineActivite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public libelle: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => InfoEntreprise, {
    foreignKey: 'domaine_activite_id',
  })
  public infoEntreprises: HasMany<typeof InfoEntreprise>
}