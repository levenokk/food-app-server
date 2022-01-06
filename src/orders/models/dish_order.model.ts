import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, ID, Int } from '@nestjs/graphql';
import { Dish } from '../../dishes/models/dish.model';
import { InstitutionOrder } from './institution_order.model';
import { User } from '../../users/models/user.model';
import { Filling } from '../../fillings/models';
import { FillingOrder } from './filling_order.model';

@Table({
  tableName: 'dish',
})
export class DishOrder extends Model {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
  })
  quality: number;

  @ForeignKey(() => Dish)
  dish_id: number;

  @ForeignKey(() => InstitutionOrder)
  institution_order_id: number;

  @ForeignKey(() => User)
  user_id: number;

  @Field(() => Number)
  @Column({
    type: DataType.FLOAT,
  })
  price: number;

  @Field(() => Number)
  @Column({
    type: DataType.FLOAT,
  })
  stock_price: number;

  @Field(() => Boolean)
  @Column({
    type: DataType.BOOLEAN,
  })
  stock: boolean;

  @Field(() => [Filling])
  @BelongsToMany(() => Filling, () => FillingOrder)
  filling: Filling[];
}
