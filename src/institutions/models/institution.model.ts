import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

type CreateAttr = {
  name: string;
  image: string;
  work_from: string;
  work_to: string;
  address: string;
  shipping_cost: number;
  free_delivery: number;
  user_id: number;
};

@ObjectType()
@Table({
  tableName: 'institutions',
})
export class Institution extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => String)
  @Column({
    type: DataType.TEXT,
  })
  name: string;

  @ForeignKey(() => User)
  user_id: number;

  @Field(() => String)
  @Column
  image: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 5,
    }),
  })
  work_from: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 5,
    }),
  })
  work_to: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 40,
    }),
  })
  address: string;

  @Field(() => Number)
  @Column({
    type: DataType.NUMBER({
      decimals: 5,
    }),
  })
  shipping_cost: number;

  @Field(() => Number)
  @Column({
    type: DataType.NUMBER({
      decimals: 5,
    }),
  })
  free_delivery: number;
}