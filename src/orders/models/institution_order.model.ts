import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Institution } from '../../institutions/models';
import { User } from '../../users/models';
import { Field, ID, ObjectType, registerEnumType, Int } from '@nestjs/graphql';
import { DishOrder } from './dish_order.model';
import { Message } from '../../messages/models';

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

export enum InstitutionOrderPayMethods {
  ONLINE = 'ONLINE',
  CARD = 'CARD',
  CACHE = 'CACHE',
}

registerEnumType(InstitutionOrderPayMethods, {
  name: 'InstitutionOrderPayMethods',
});

type CreateAttr = {
  institution_id: number;
  user_id: number;
  status: Status;
  rating: number;
  delivery: number;
  latitude: string;
  longitude: string;
  cost: number;
  pay_method: InstitutionOrderPayMethods;
};

@ObjectType()
@Table({
  tableName: 'institution_orders',
})
export class InstitutionOrder extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => ID)
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
    defaultValue: 0,
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

  @Field(() => [DishOrder])
  @HasMany(() => DishOrder)
  dish_orders: DishOrder[];

  @Field(() => User)
  @BelongsTo(() => User)
  user: User;

  @Field(() => InstitutionOrderPayMethods)
  @Column({
    type: DataType.ENUM('ONLINE', 'CARD', 'CACHE'),
  })
  pay_method: InstitutionOrderPayMethods;

  @Field(() => Message, {
    defaultValue: [],
  })
  @HasMany(() => Message, {
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
