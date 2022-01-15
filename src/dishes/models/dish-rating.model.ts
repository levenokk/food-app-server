import {
  Column,
  ForeignKey,
  Model,
  Table,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Dish } from './dish.model';
import { User } from '../../users/models';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

type CreateAttr = {
  message: string;
  dish_id: number;
  user_id: number;
  stars: number;
};

@ObjectType()
@Table({
  tableName: 'dish_ratings',
  updatedAt: false,
})
export class DishRating extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => String)
  @Column
  message: string;

  @ForeignKey(() => Dish)
  dish_id: number;

  @ForeignKey(() => User)
  user_id: number;

  @Field(() => User)
  @BelongsTo(() => User)
  user: User;

  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
  })
  stars: number;
}
