import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Dish } from '../../dishes/models';
import { InstitutionOrder } from './institution_order.model';
import { User } from '../../users/models';
import { Filling } from '../../fillings/models';
import { FillingOrder } from './filling_order.model';

type CreateAttr = {
  quality: number;
  dish_id: number;
  institution_order_id: number;
  user_id: number;
  price: number;
};

@ObjectType()
@Table({
  tableName: 'dish_orders',
})
export class DishOrder extends Model<CreateAttr> {
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

  @Field(() => Int)
  @Column({
    type: DataType.FLOAT,
  })
  price: number;

  @Field(() => [Filling])
  @BelongsToMany(() => Filling, () => FillingOrder)
  fillings: Filling[];
}
