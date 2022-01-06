import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Institution } from '../../institutions/models';
import { User } from '../../users/models/user.model';
import { Field, ID, ObjectType, registerEnumType, Int } from '@nestjs/graphql';
import { DishOrder } from './dish_order.model';

// todo: переделать поля Number на INT

export enum Status {
  NEW = 'NEW',
  CANCELED = 'CANCELED',
  IN_ROAD = 'IN_ROAD',
  COOKING = 'COOKING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(Status, {
  name: 'Status',
});

@ObjectType()
@Table({
  tableName: 'institutionOrder_orders',
})
export class InstitutionOrder extends Model {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Institution)
  institution_id: number;

  @ForeignKey(() => User)
  user_id: number;

  @Field(() => Status)
  @Column({
    type: DataType.ENUM(
      'NEW',
      'CANCELED',
      'IN_ROAD',
      'COOKING',
      'ACCEPTED',
      'COMPLETED',
    ),
  })
  status: Status;

  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
  })
  rating: number;

  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
  })
  delivery: number;

  @Field(() => String)
  @Column
  latitude: string;

  @Field(() => String)
  @Column
  longitude: string;

  @Field(() => Boolean)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_hide: boolean;

  @Field(() => [DishOrder])
  @HasMany(() => DishOrder)
  dish_orders: DishOrder[];
}
