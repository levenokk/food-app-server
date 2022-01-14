import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Dish } from './dish.model';

@Table({
  tableName: 'favorite_dishes',
  createdAt: false,
  updatedAt: false,
})
export class FavoriteDish extends Model {
  @ForeignKey(() => User)
  user_id: number;

  @ForeignKey(() => Dish)
  dish_id: number;
}
