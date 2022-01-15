import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from './user.model';

export enum UserPayMethod {
  ONLINE = 'ONLINE',
  CARD = 'CARD',
  CACHE = 'CACHE',
}

registerEnumType(UserPayMethod, {
  name: 'UserPayMethod',
  description: 'pay methods',
});

type CreateAttrs = {
  method: 'ONLINE' | 'CARD' | 'CACHE';
  user_id: number;
};

@ObjectType()
@Table({
  tableName: 'user_pay_methods',
  createdAt: false,
  updatedAt: false,
})
export class UserPay extends Model<CreateAttrs> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => UserPayMethod)
  @Column({
    type: DataType.ENUM('ONLINE', 'CARD', 'CACHE'),
  })
  method: UserPayMethod;

  @ForeignKey(() => User)
  user_id: number;
}
