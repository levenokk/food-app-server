import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InstitutionOrder } from '../../orders/models';
import { User } from '../../users/models';
import { Field, ID, ObjectType } from '@nestjs/graphql';

type CreateAttr = {
  institution_order_id: number;
  user_id: number;
  message: string;
};

@ObjectType()
@Table({
  tableName: 'messages',
  updatedAt: false,
})
export class Message extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => ID, {
    name: 'order_id',
  })
  @ForeignKey(() => InstitutionOrder)
  institution_order_id: number;

  @BelongsTo(() => InstitutionOrder)
  institution_order: InstitutionOrder;

  @ForeignKey(() => User)
  user_id: number;

  @Field(() => User)
  @BelongsTo(() => User)
  user: User;

  @Field(() => String)
  @Column
  message: string;

  @Field(() => Date)
  createdAt: Date;
}
