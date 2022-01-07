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

type CreateAttr = {
  name: string;
  image: string;
  price: number;
  stock_price: number;
  stock_time: number;
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

  @Field(() => Float)
  @Column({
    type: DataType.FLOAT,
  })
  stock_price: number;

  @Field(() => Date)
  @Column({
    type: DataType.DATE,
  })
  stock_time: string;

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
}
