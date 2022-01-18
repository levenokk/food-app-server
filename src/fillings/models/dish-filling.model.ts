import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { Dish } from '../../dishes/models';
import { Filling } from './filling.model';

@Table({
  tableName: 'dish_fillings',
})
export class DishFilling extends Model {
  @ForeignKey(() => Filling)
  filling_id: number;

  @ForeignKey(() => Dish)
  dish_id: number;
}
