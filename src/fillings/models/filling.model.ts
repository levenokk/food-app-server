import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Institution } from '../../institutions/models';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Dish } from '../../dishes/models/dish.model';
import { DishFilling } from './dish-filling.model';
import { DishOrder, FillingOrder } from '../../orders/models';

type CreateAttrs = {
  name: string;
  price: number;
  weight: number;
  image: string;
  institution_id: number;
};

@ObjectType()
@Table({
  tableName: 'fillings',
  createdAt: false,
  updatedAt: false,
})
export class Filling extends Model<CreateAttrs> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => String)
  @Column
  name: string;

  @Field(() => Float)
  @Column({
    type: DataType.FLOAT,
  })
  price: number;

  @Field(() => Float)
  @Column({
    type: DataType.FLOAT,
  })
  weight: number;

  @Field(() => String)
  @Column
  image: string;

  @ForeignKey(() => Institution)
  institution_id: number;

  @Field(() => [Dish])
  @BelongsToMany(() => Dish, () => DishFilling)
  dishes: Dish[];

  @BelongsToMany(() => DishOrder, () => FillingOrder)
  order_dishes: DishOrder[];
}
