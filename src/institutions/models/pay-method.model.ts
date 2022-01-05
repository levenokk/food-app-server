import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Institution } from './institution.model';

export enum PayMethod {
  ALL = 'ALL',
  ONLINE = 'ONLINE',
  CARD = 'CARD',
  CACHE = 'CACHE',
}

registerEnumType(PayMethod, {
  name: 'PayMethod',
  description: 'pay methods',
});

type CreateAttrs = {
  method: 'ALL' | 'ONLINE' | 'CARD' | 'CACHE';
  institution_id: number;
};

@ObjectType()
@Table({
  tableName: 'institution_pay_methods',
  createdAt: false,
  updatedAt: false,
})
export class InstitutionPayMethod extends Model<CreateAttrs> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => PayMethod)
  @Column({
    type: DataType.ENUM('ALL', 'ONLINE', 'CARD', 'CACHE'),
  })
  method: PayMethod;

  @ForeignKey(() => Institution)
  institution_id: number;
}
