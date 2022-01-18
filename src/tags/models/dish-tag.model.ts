import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { Tag } from './tag.model';
import { Dish } from '../../dishes/models';

@Table({
  tableName: 'dish_tags',
  createdAt: false,
  updatedAt: false,
})
export class DishTag extends Model {
  @ForeignKey(() => Tag)
  tag_id: number;

  @ForeignKey(() => Dish)
  dish_id: number;
}
