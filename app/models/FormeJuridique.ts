import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@adonisjs/lucid/orm'
import InfoEntreprise from './InfoEntreprise'

export default class FormeJuridique extends BaseModel {
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
    foreignKey: 'forme_juridique_id',
  })
  public infoEntreprises: HasMany<typeof InfoEntreprise>
}