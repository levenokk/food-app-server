import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { Institution } from './institution.model';
import { User } from '../../users/models';

@Table({
  tableName: 'favorite_institutions',
  updatedAt: false,
  createdAt: false,
})
export class FavoriteInstitutions extends Model {
  @ForeignKey(() => Institution)
  institution_id: number;

  @ForeignKey(() => User)
  user_id: number;
}
