import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Institution } from '../../institutions/models';
import { Tag } from '../../tags/models';
import { DishTag } from '../../tags/models/dish-tag.model';
import { DishFilling, Filling } from '../../fillings/models';
import { DishOrder } from '../../orders/models';
import { User } from '../../users/models';
import { FavoriteDish } from './favorite-dish.model';
import { DishRating } from './dish-rating.model';

type CreateAttr = {
  name: string;
  image: string;
  price: number;
  stock_price?: number;
  stock_time?: string;
  composition: string;
  institution_id: number;
};

@ObjectType()
@Table({
  tableName: 'dishes',
  createdAt: false,
  updatedAt: false,
})
export class Dish extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 30,
    }),
  })
  name: string;

  @Field(() => String)
  @Column
  image: string;

  @Field(() => Float)
  @Column({
    type: DataType.FLOAT,
  })
  price: number;

  @Field(() => Float, {
    nullable: true,
  })
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  stock_price: number;

  @Field(() => Date, {
    nullable: true,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  stock_time: string | null;

  @Field(() => String)
  @Column
  composition: string;

  @ForeignKey(() => Institution)
  institution_id: number;

  @Field(() => Institution)
  @BelongsTo(() => Institution)
  institution: Institution;

  @Field(() => [Tag])
  @BelongsToMany(() => Tag, () => DishTag)
  tags: Tag[];

  @Field(() => [Filling])
  @BelongsToMany(() => Filling, () => DishFilling)
  fillings: Filling[];

  @Field(() => [DishOrder])
  @HasMany(() => DishOrder)
  dish_orders: DishOrder[];

  @BelongsToMany(() => User, () => FavoriteDish)
  users: User[];

  @HasMany(() => DishRating)
  comments: DishRating;
}
