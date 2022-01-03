import {
  Column,
  Model,
  DataType,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Institution } from './institution.model';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Day {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

registerEnumType(Day, {
  name: 'Day',
  description: 'work day',
});

type CreateAttrs = {
  day:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  institution_id: number;
};

@ObjectType()
@Table({
  tableName: 'work_days',
  createdAt: false,
  updatedAt: false,
})
export class WorkDay extends Model<CreateAttrs> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => Day)
  @Column({
    type: DataType.ENUM(
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ),
  })
  day: Day;

  @ForeignKey(() => Institution)
  institution_id: number;
}
