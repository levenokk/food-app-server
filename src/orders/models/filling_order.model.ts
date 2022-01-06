import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { Filling } from '../../fillings/models';
import { DishOrder } from './dish_order.model';

@Table({
  tableName: 'filling_orders',
  createdAt: false,
  updatedAt: false,
})
export class FillingOrder extends Model {
  @ForeignKey(() => Filling)
  filling_id: number;

  @ForeignKey(() => DishOrder)
  dish_order_id: number;
}
